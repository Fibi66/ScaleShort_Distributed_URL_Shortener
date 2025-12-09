# ScaleShort

A high-performance distributed URL shortener with two-tier caching (Caffeine + Redis).

## Quick Start

### Prerequisites

- **Java 17+**
- **Redis** (standalone for demo, cluster for production)

### 1. Install Redis

**Ubuntu/Debian:**
```bash
sudo apt-get update && sudo apt-get install -y redis-server
sudo systemctl start redis
redis-cli ping  # Should return: PONG
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows (WSL):**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

### 2. Build & Run

```bash
# Build the project
./gradlew clean build

# Run the application
java -jar build/libs/scaleshort-1.0.0.jar
```

### 3. Open Browser

Visit: **http://localhost:8080**

You'll see the web interface where you can shorten URLs.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/urls` | Create short URL |
| GET | `/api/v1/urls/{code}` | Get original URL |
| GET | `/r/{code}` | Redirect to original URL |
| GET | `/actuator/health` | Health check |

### Examples

**Create Short URL:**
```bash
curl -X POST http://localhost:8080/api/v1/urls \
  -H 'Content-Type: application/json' \
  -d '{"longUrl":"https://example.com/very/long/url"}'

# Response: {"code":"aBc1234","shortUrl":"http://localhost:8080/r/aBc1234"}
```

**Get Original URL:**
```bash
curl http://localhost:8080/api/v1/urls/aBc1234
# Response: {"longUrl":"https://example.com/very/long/url"}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `APP_BASE_URL` | Base URL for short links | `http://localhost:8080` |
| `DEFAULT_TTL_SECONDS` | URL expiration time | `2592000` (30 days) |

### Example

```bash
REDIS_HOST=redis.example.com APP_BASE_URL=https://short.ly java -jar build/libs/scaleshort-1.0.0.jar
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Spring Boot App                       │
├─────────────────────────────────────────────────────────┤
│  L1 Cache: Caffeine (10K entries, 10min TTL)            │
├─────────────────────────────────────────────────────────┤
│  L2 Cache: Redis (30-day TTL)                           │
└─────────────────────────────────────────────────────────┘
```

- **Caffeine**: In-memory cache for hot data (sub-ms latency)
- **Redis**: Persistent storage for all URLs

## Production Mode (Redis Cluster)

For production with Redis Cluster:

```bash
# Start 6-node Redis Cluster
docker-compose up -d

# Run with cluster profile
java -jar build/libs/scaleshort-1.0.0.jar --spring.profiles.active=cluster
```

## Performance

- **26,000 QPS** for URL retrieval
- **4,500 QPS** for URL creation
- **P99 < 40ms** latency

## License

MIT
