package com.scaleshort.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UrlRepository {
    
    private static final String KEY_PREFIX = "u:";
    private final RedisTemplate<String, String> redisTemplate;
    
    public boolean saveIfNotExists(String code, String longUrl, long ttlSeconds) {
        String key = KEY_PREFIX + code;
        
        try {
            // Use SetOption.SET_IF_ABSENT with timeout for atomic SET NX EX
            // This is the recommended way for atomic operations with Spring Data Redis
            Boolean result = redisTemplate.opsForValue()
                    .setIfAbsent(key, longUrl, Duration.ofSeconds(ttlSeconds));
            
            boolean success = Boolean.TRUE.equals(result);
            if (success) {
                log.debug("Successfully saved URL with code: {} with TTL: {} seconds", code, ttlSeconds);
            } else {
                log.debug("Code already exists: {}", code);
            }
            
            return success;
        } catch (Exception e) {
            log.error("Error saving URL to Redis for code: {}", code, e);
            throw new RuntimeException("Failed to save URL", e);
        }
    }
    
    public String findByCode(String code) {
        String key = KEY_PREFIX + code;
        
        try {
            String longUrl = redisTemplate.opsForValue().get(key);
            if (longUrl != null) {
                log.debug("Found URL for code: {}", code);
            } else {
                log.debug("No URL found for code: {}", code);
            }
            return longUrl;
        } catch (Exception e) {
            log.error("Error retrieving URL from Redis for code: {}", code, e);
            return null;
        }
    }
    
    public void setExpire(String code, long ttlSeconds) {
        String key = KEY_PREFIX + code;
        try {
            redisTemplate.expire(key, Duration.ofSeconds(ttlSeconds));
        } catch (Exception e) {
            log.error("Error setting expiration for code: {}", code, e);
        }
    }
}