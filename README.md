# Shorto

A High-Performance Distributed **URL Shortening Service**

**Live Demo:** [https://s.zhifeiye.com/](https://s.zhifeiye.com/) (The service down, will come back soon)

---

## Demo

https://github.com/user-attachments/assets/demo.mp4

> *If the video doesn't load, see [docs/demo.mp4](docs/demo.mp4)*

---


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



## System Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Client    │ ──▶ │  Spring Boot App │ ──▶ │  Caching Layer  │ ──▶ │  Redis Storage  │
│ Browser/Mobile│     │   REST | Service │     │ L1: Caffeine    │     │   AOF Enabled   │
└──────────────┘     └──────────────────┘     │ L2: Redis       │     └─────────────────┘
                                              └─────────────────┘
```

- **Caffeine (L1)**: In-memory cache for hot data (sub-ms latency)
- **Redis (L2)**: Persistent storage for all URLs with AOF durability


## Core Logic & Flows

### URL Shortening Flow

![URL Shortening Flow](docs/shortening-flow.png)

*Sequence diagram illustrating the interaction between Client, Controller, Service, and Redis.*

### Redirect Flow

![URL Redirect Flow](docs/redirect-flow.png)



---


### Collision Handling Flow

```
        ┌─────────────────────────┐
        │  Generate Short Code    │
        └───────────┬─────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   ┌─────────────┐     ┌─────────────┐
   │  ✓ Success  │     │  ✗ Collision│
   │ Return Code │     │             │
   └─────────────┘     └──────┬──────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Retry with Salt │
                    │ hash(url + "#1")│
                    └────────┬────────┘
                             │
                             └──── (loop back)
```

---

## Data Storage & Persistence

Optimized for high-speed read/write operations using Redis key-value store with durability guarantees.

### Data Mappings

| Type | Key Pattern | Value | Purpose |
|------|-------------|-------|---------|
| **Forward Mapping** | `c:{code}` | `{url}` | Code → URL lookup |
| **Reverse Index** | `u:{url}` | `{code}` | Deduplication |

### Storage Configuration

| Setting | Value |
|---------|-------|
| **Database** | Redis Key-Value |
| **TTL Policy** | 30 Days (Default) |
| **Persistence** | AOF Enabled |




## Performance

- **200 QPS** for URL retrieval
- **100 QPS** for URL creation
- **P99 < 40ms** latency
