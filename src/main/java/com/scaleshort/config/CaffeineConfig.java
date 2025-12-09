package com.scaleshort.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
public class CaffeineConfig implements CachingConfigurer {
    
    @Value("${cache.caffeine.max-size:10000}")
    private long maxSize;
    
    @Value("${cache.caffeine.expire-after-write-minutes:10}")
    private long expireAfterWriteMinutes;
    
    @Value("${cache.caffeine.negative-cache-expire-seconds:60}")
    private long negativeCacheExpireSeconds;
    
    @Bean
    @Primary
    @Override
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCacheNames(Arrays.asList("urls", "negative-urls"));
        cacheManager.setCaffeine(caffeineCacheBuilder());
        
        // Register cache with different config for negative results
        cacheManager.registerCustomCache("negative-urls",
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(negativeCacheExpireSeconds, TimeUnit.SECONDS)
                .recordStats()
                .build());
        
        return cacheManager;
    }
    
    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(expireAfterWriteMinutes, TimeUnit.MINUTES)
                .recordStats();  // Enable stats for monitoring
    }
}