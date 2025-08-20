package com.scaleshort.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RateLimitService {
    
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    @Value("${ratelimit.requests-per-minute:60}")
    private int requestsPerMinute;
    
    public boolean tryConsume(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket());
        boolean consumed = bucket.tryConsume(1);
        
        if (!consumed) {
            log.debug("Rate limit exceeded for key: {}", key);
        }
        
        return consumed;
    }
    
    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.classic(
            requestsPerMinute,
            Refill.intervally(requestsPerMinute, Duration.ofMinutes(1))
        );
        
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    public void cleanupOldBuckets() {
        // This could be scheduled to run periodically to clean up old entries
        // For production, consider using a more sophisticated approach with TTL
        if (buckets.size() > 10000) {
            log.info("Clearing rate limit buckets due to size: {}", buckets.size());
            buckets.clear();
        }
    }
}