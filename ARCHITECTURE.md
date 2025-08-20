

# ScaleShort Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS / USERS                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│     User 1 (Browser/App)                    User 2 (Browser/App)             │
│           │                                        │                          │
│           │  POST /api/v1/urls                    │  GET /r/xyz789           │
│           │  {longUrl: "site.com"}                │  (redirect)              │
│           ▼                                        ▼                          │
└───────────┬────────────────────────────────────────┬─────────────────────────┘
            │                                        │
            │         HTTP/HTTPS Requests            │
            ▼                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            LOAD BALANCER (Optional)                           │
│                         (Nginx/HAProxy/AWS ALB/K8s)                          │
└──────────────────────────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SCALESHORT APPLICATION INSTANCES                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  ScaleShort #1  │  │  ScaleShort #2  │  │  ScaleShort #3  │              │
│  │  (Spring Boot)  │  │  (Spring Boot)  │  │  (Spring Boot)  │              │
│  │   Port: 8080    │  │   Port: 8081    │  │   Port: 8082    │              │
│  │                 │  │                 │  │                 │              │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │              │
│  │ │ Controller  │ │  │ │ Controller  │ │  │ │ Controller  │ │              │
│  │ └──────┬──────┘ │  │ └──────┬──────┘ │  │ └──────┬──────┘ │              │
│  │        ▼        │  │        ▼        │  │        ▼        │              │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │              │
│  │ │   Service   │ │  │ │   Service   │ │  │ │   Service   │ │              │
│  │ │   Layer     │ │  │ │   Layer     │ │  │ │   Layer     │ │              │
│  │ └──────┬──────┘ │  │ └──────┬──────┘ │  │ └──────┬──────┘ │              │
│  │        ▼        │  │        ▼        │  │        ▼        │              │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │              │
│  │ │  L1 Cache   │ │  │ │  L1 Cache   │ │  │ │  L1 Cache   │ │              │
│  │ │  (Caffeine) │ │  │ │  (Caffeine) │ │  │ │  (Caffeine) │ │              │
│  │ │  10K items  │ │  │ │  10K items  │ │  │ │  10K items  │ │              │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                ▼                                              │
│                    Lettuce Redis Client (Connection Pool)                     │
│                          - Max connections: 16                               │
│                          - Thread-safe                                       │
│                          - Automatic failover                                │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          REDIS CLUSTER (L2 CACHE)                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│   ┌──────────────────────────────────────────────────────────────┐           │
│   │                     16,384 Hash Slots Total                   │           │
│   └──────────────────────────────────────────────────────────────┘           │
│                                                                                │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│   │  Master 1   │     │  Master 2   │     │  Master 3   │                   │
│   │  Port:7000  │     │  Port:7001  │     │  Port:7002  │                   │
│   │ Slots:0-5460│     │Slots:5461-  │     │Slots:10923-│                   │
│   │             │     │    10922    │     │   16383    │                   │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                   │
│          │                   │                   │                           │
│          ▼                   ▼                   ▼                           │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│   │  Replica 1  │     │  Replica 2  │     │  Replica 3  │                   │
│   │  Port:7003  │     │  Port:7004  │     │  Port:7005  │                   │
│   │  (Backup)   │     │  (Backup)   │     │  (Backup)   │                   │
│   └─────────────┘     └─────────────┘     └─────────────┘                   │
│                                                                                │
│   Features:                                                                   │
│   • Automatic sharding across nodes                                          │
│   • SET NX EX atomic operations for uniqueness                               │
│   • Automatic failover on node failure                                       │
│   • Data persistence with RDB/AOF                                            │
└──────────────────────────────────────────────────────────────────────────────┘

## Request Flow Examples

### User 1: Creating a Short URL
```
1. POST request to any ScaleShort instance
2. Generate unique code (e.g., "abc123")
3. Check L1 Caffeine cache (likely miss for new URL)
4. Use SET NX EX on Redis to ensure atomicity
5. Store in Redis with TTL (slot determined by CRC16 hash)
6. Warm L1 cache with the new entry
7. Return short URL to user
```

### User 2: Accessing a Short URL
```
1. GET request to any ScaleShort instance
2. Extract code from URL (e.g., "xyz789")
3. Check L1 Caffeine cache (fast lookup, <1ms if hit)
4. If cache miss, query Redis cluster
5. Redis determines slot: CRC16("u:xyz789") % 16384
6. Fetch from appropriate master node
7. Cache result in L1 for future requests
8. Return 302 redirect or URL data
```

## Concurrency & Consistency

### How Multiple Users Don't Conflict:

1. **Stateless Application Servers**
   - Any instance can handle any request
   - No session affinity required
   - Horizontal scaling is seamless

2. **Unique Code Generation**
   - Base62 encoding with timestamp + random
   - SET NX (set if not exists) ensures no duplicates
   - Retry mechanism on collision

3. **Cache Consistency**
   - Each instance has independent L1 cache
   - Redis is single source of truth
   - TTL ensures eventual consistency

4. **Thread Safety**
   - Lettuce client is thread-safe
   - Connection pooling handles concurrent requests
   - Caffeine cache is concurrent-friendly

## Performance Under Load

With 2 users (or 2000 users):
- **L1 Cache Hit**: ~0.1ms response time
- **L2 Redis Hit**: ~2-5ms response time  
- **Cache Miss**: ~10-20ms (includes Redis write)
- **System can handle**: 26,000 QPS for reads, 4,500 QPS for writes

## Scaling Considerations

### Horizontal Scaling
- Add more ScaleShort instances behind load balancer
- Each instance handles ~8,000-10,000 QPS

### Redis Cluster Scaling
- Add more master/replica pairs
- Redistribute hash slots
- Zero-downtime resharding

### Cache Optimization
- Tune Caffeine size based on memory
- Adjust TTL based on access patterns
- Monitor hit rates via Micrometer metrics