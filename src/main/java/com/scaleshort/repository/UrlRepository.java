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

    private static final String CODE_PREFIX = "c:";  // code -> url
    private static final String URL_PREFIX = "u:";   // url -> code (反向索引)
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 查询 URL 是否已有短码
     */
    public String findCodeByUrl(String longUrl) {
        String key = URL_PREFIX + longUrl;
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Error finding code by URL", e);
            return null;
        }
    }

    /**
     * 保存短码映射（双向索引）
     * 返回 true 表示成功，false 表示短码已被占用
     */
    public boolean save(String code, String longUrl, long ttlSeconds) {
        String codeKey = CODE_PREFIX + code;
        String urlKey = URL_PREFIX + longUrl;
        Duration ttl = Duration.ofSeconds(ttlSeconds);

        try {
            // 先检查短码是否已存在
            Boolean codeSet = redisTemplate.opsForValue().setIfAbsent(codeKey, longUrl, ttl);
            if (!Boolean.TRUE.equals(codeSet)) {
                // 短码已被占用，检查是否是同一个 URL
                String existingUrl = redisTemplate.opsForValue().get(codeKey);
                if (longUrl.equals(existingUrl)) {
                    log.debug("Same URL already has this code: {}", code);
                    return true;
                }
                log.debug("Code collision: {} is used by another URL", code);
                return false;
            }

            // 保存反向索引
            redisTemplate.opsForValue().set(urlKey, code, ttl);
            log.debug("Saved URL mapping: {} <-> {}", code, longUrl);
            return true;
        } catch (Exception e) {
            log.error("Error saving URL mapping", e);
            throw new RuntimeException("Failed to save URL", e);
        }
    }

    /**
     * 根据短码查询 URL
     */
    public String findByCode(String code) {
        String key = CODE_PREFIX + code;
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Error retrieving URL for code: {}", code, e);
            return null;
        }
    }
}