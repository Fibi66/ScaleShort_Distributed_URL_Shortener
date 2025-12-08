#!/bin/sh
echo "Starting ScaleShort with Redis configuration:"
echo "REDIS_HOST=${REDIS_HOST:-not set}"
echo "REDIS_PORT=${REDIS_PORT:-not set}"
echo "REDIS_SSL_ENABLED=${REDIS_SSL_ENABLED:-not set}"

exec java -Xmx512m \
    -Dspring.data.redis.host="${REDIS_HOST:-localhost}" \
    -Dspring.data.redis.port="${REDIS_PORT:-6379}" \
    -Dspring.data.redis.password="${REDIS_PASSWORD:-}" \
    -Dspring.data.redis.ssl.enabled="${REDIS_SSL_ENABLED:-false}" \
    -jar /app/app.jar
