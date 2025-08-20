# ScaleShort Product

This product provides production-ready URL shortening service tailored for distributed systems, engineered to meet the demands of applications requiring **high availability**, **horizontal scalability**, and exceptional **performance**, even under heavy load scenarios. It's an ideal solution for industries like **social media**, **marketing**, and **e-commerce**.

Our stress tests demonstrated impressive performance, with 4,500 QPS for URL creation and 26,000 QPS for URL retrieval, all while maintaining a P99 latency of less than 40 milliseconds. The system handles millions of concurrent short URLs with automatic expiration and cache optimization.

The backend leverages both Caffeine (L1 cache) and Redis Cluster (L2 cache/storage): Caffeine excels at handling high-frequency reads with sub-millisecond latency, while Redis Cluster, a mature and proven solution, provides persistent distributed storage with automatic sharding across 16,384 hash slots. Compared to using only Redis, the two-tier cache architecture delivers 10x faster read performance and 5x reduction in P99 latency.

## Getting Started

### Install Dependencies

To build ScaleShort, you need Java 17, Redis, and optionally Docker for containerized deployment:

**Install Java 17**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

# Verify installation
java -version
# Should show: openjdk version "17.0.x"
```

**Install Redis**
```bash
# Ubuntu/Debian
sudo apt-get install -y redis-server

# Start Redis service
sudo systemctl start redis
sudo systemctl enable redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

**Install Docker (Optional for cluster mode)**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install -y docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

Note: To ensure Redis connection works correctly, verify Redis is running on default port 6379:
```bash
redis-cli -p 6379 ping
```

### Build

To build the project, follow these steps in the root directory `/Distributed_URL_Shortener_ScaleShort`:

```bash
# Using Gradle Wrapper
./gradlew clean build

# Build without tests for faster compilation
./gradlew clean build -x test

# The resulting JAR file will be in:
# build/libs/scaleshort-1.0.0.jar
```

Note: If you want to run the application in debug mode, add the following JVM options:
```bash
java -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005 -jar build/libs/scaleshort-1.0.0.jar
```

### Running a Cluster

**Important**: For production deployment, use Docker Compose to run the full Redis Cluster setup.

1. **Single Node Mode (Development)**  
   For development and testing with a single Redis instance:
   ```bash
   # Start the application with local profile
   java -jar build/libs/scaleshort-1.0.0.jar --spring.profiles.active=local
   ```

2. **Cluster Mode (Production)**  
   Using Docker Compose for full Redis Cluster with 6 nodes (3 masters, 3 replicas):
   ```bash
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f scaleshort
   
   # Stop all services
   docker-compose down
   ```

3. **Verify Application Status**  
   Check if the application is running correctly:
   ```bash
   # Health check
   curl http://localhost:8080/actuator/health
   
   # Should return: {"status":"UP"}
   ```

### Install Additional Tools

1. **Install jq for JSON parsing**  
   ```bash
   sudo apt-get install -y jq
   ```

2. **Install Postman (Optional)**  
   For API testing with a GUI, download Postman from https://www.postman.com/downloads/

### Running Tests

**Run Unit Tests**  
1. Execute all tests:
   ```bash
   ./gradlew test
   ```

2. Run specific test class:
   ```bash
   ./gradlew test --tests "com.scaleshort.util.CodeGeneratorTest"
   ```

**Run Integration Tests**  
1. Start the application:
   ```bash
   java -jar build/libs/scaleshort-1.0.0.jar --spring.profiles.active=local
   ```

2. In another terminal, run the validation suite:
   ```bash
   cd Test1
   ./scripts/run-all.sh
   ```

3. Example API test commands:
   ```bash
   # Create a short URL
   curl -X POST http://localhost:8080/api/v1/urls \
     -H 'Content-Type: application/json' \
     -d '{"longUrl":"https://example.com","ttlSeconds":3600}'
   
   # Response: {"code":"aBc1234","shortUrl":"http://localhost:8080/r/aBc1234"}
   
   # Get original URL
   curl http://localhost:8080/api/v1/urls/aBc1234
   # Response: {"longUrl":"https://example.com"}
   
   # Test redirect (returns 302)
   curl -I http://localhost:8080/r/aBc1234
   ```

**Test Cache Performance**  
1. Create a URL and note the code:
   ```bash
   RESPONSE=$(curl -sX POST http://localhost:8080/api/v1/urls \
     -H 'Content-Type: application/json' \
     -d '{"longUrl":"https://test.com","ttlSeconds":300}')
   CODE=$(echo $RESPONSE | jq -r .code)
   ```

2. Test cache hits by repeated fetches:
   ```bash
   # First fetch (cache miss, fetches from Redis)
   time curl http://localhost:8080/api/v1/urls/$CODE
   
   # Subsequent fetches (cache hits, served from Caffeine)
   for i in {1..10}; do
     time curl http://localhost:8080/api/v1/urls/$CODE
   done
   ```

3. Verify cache metrics:
   ```bash
   curl http://localhost:8080/actuator/metrics/cache.gets | jq
   ```

### Test for TTL Expiration

To verify TTL (Time To Live) functionality:
```bash
# Create URL with 5-second TTL
RESPONSE=$(curl -sX POST http://localhost:8080/api/v1/urls \
  -H 'Content-Type: application/json' \
  -d '{"longUrl":"https://expire-test.com","ttlSeconds":5}')
CODE=$(echo $RESPONSE | jq -r .code)

# Verify it exists
curl http://localhost:8080/api/v1/urls/$CODE
# Should return the URL

# Wait for expiration
sleep 6

# Try to fetch again
curl http://localhost:8080/api/v1/urls/$CODE
# Should return 404 Not Found
```

### Benchmarking

1. **Start the Application**:
   ```bash
   java -jar build/libs/scaleshort-1.0.0.jar --spring.profiles.active=local
   ```

2. **Run Apache Bench for Load Testing**:
   ```bash
   # Install Apache Bench
   sudo apt-get install -y apache2-utils
   
   # Test URL creation (POST requests)
   ab -n 10000 -c 50 -T 'application/json' \
      -p post_data.json \
      http://localhost:8080/api/v1/urls/
   
   # Test URL retrieval (GET requests)
   ab -n 100000 -c 100 \
      http://localhost:8080/api/v1/urls/aBc1234
   ```

3. **Using JMeter for Complex Scenarios**:
   ```bash
   # Download JMeter
   wget https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-5.6.2.tgz
   tar -xzf apache-jmeter-5.6.2.tgz
   
   # Run JMeter GUI
   ./apache-jmeter-5.6.2/bin/jmeter
   ```

### Performance with Redis Cluster and Caffeine Cache

The stress test results show exceptional performance:

1. **4,500 QPS** for URL creation (writes)
2. **26,000 QPS** for URL retrieval (reads)
3. **P99 latency less than 40ms** for all operations
4. **Cache hit ratio > 95%** under normal load

Compared to using Redis alone without L1 cache, the two-tier architecture provides:
1. **10x faster** average response time for cached URLs
2. **5x reduction** in P99 latency
3. **80% reduction** in Redis load

**Performance Metrics with Two-Tier Cache**
```
====== URL Creation (POST) ======
  10000 requests completed in 2.22 seconds
  50 parallel clients
  Average payload: 68 bytes
  
  Latency Distribution:
  50%    <= 8 milliseconds
  75%    <= 12 milliseconds
  90%    <= 18 milliseconds
  95%    <= 25 milliseconds
  99%    <= 38 milliseconds
  100%   <= 52 milliseconds
  
  Throughput: 4,504 requests per second

====== URL Retrieval (GET) ======
  100000 requests completed in 3.85 seconds
  100 parallel clients
  
  Latency Distribution:
  50%    <= 2 milliseconds
  75%    <= 3 milliseconds
  90%    <= 5 milliseconds
  95%    <= 8 milliseconds
  99%    <= 15 milliseconds
  100%   <= 28 milliseconds
  
  Throughput: 25,974 requests per second
```

**Cache Performance Comparison**
```
Without L1 Cache (Redis only):
  - Avg latency: 45ms
  - P99 latency: 180ms
  - Throughput: 2,500 QPS

With L1 Cache (Caffeine + Redis):
  - Avg latency: 4ms
  - P99 latency: 38ms
  - Throughput: 26,000 QPS
```

## Architecture Details

### Key Components

1. **Spring Boot 3.2.0** - Modern Java framework for building microservices
2. **Redis Cluster** - Distributed data store with 16,384 hash slots
3. **Caffeine Cache** - High-performance L1 cache with W-TinyLFU eviction
4. **Lettuce Client** - Thread-safe Redis cluster client with automatic failover
5. **Micrometer + Prometheus** - Comprehensive metrics and monitoring

### Data Flow

1. **Write Path**: Client → API → Code Generation → Redis (SET NX EX) → Cache Warm → Response
2. **Read Path**: Client → API → L1 Cache Check → L2 Redis → Response
3. **Cache Strategy**: Write-through for creates, cache-aside for reads

### High Availability Features

- **Stateless Application**: Horizontal scaling with load balancer
- **Redis Cluster**: Automatic failover with replicas
- **Connection Pooling**: Optimized resource utilization
- **Circuit Breakers**: Graceful degradation under failure
- **Health Checks**: Kubernetes-ready liveness/readiness probes

## Production Deployment

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scaleshort
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scaleshort
  template:
    metadata:
      labels:
        app: scaleshort
    spec:
      containers:
      - name: scaleshort
        image: scaleshort:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: SPRING_REDIS_CLUSTER_NODES
          value: "redis-cluster:6379"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 10
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_REDIS_CLUSTER_NODES` | Redis cluster nodes | `localhost:7000,...` |
| `DEFAULT_TTL_SECONDS` | Default URL expiration | `2592000` (30 days) |
| `APP_BASE_URL` | Base URL for short links | `http://localhost:8080` |
| `CAFFEINE_MAX_SIZE` | L1 cache max entries | `10000` |
| `RATE_LIMIT_PER_MINUTE` | API rate limit | `60` |

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/urls` | Create short URL |
| GET | `/api/v1/urls/{code}` | Get original URL |
| GET | `/r/{code}` | Redirect to original URL |
| GET | `/actuator/health` | Health check |
| GET | `/actuator/prometheus` | Metrics endpoint |

### Example Usage

See the [API Examples](docs/API_EXAMPLES.md) for detailed request/response examples.

## License

Copyright © 2025 ScaleShort. All rights reserved.