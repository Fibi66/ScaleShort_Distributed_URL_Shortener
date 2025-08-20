package com.scaleshort.service;

import com.scaleshort.dto.CreateUrlRequest;
import com.scaleshort.dto.CreateUrlResponse;
import com.scaleshort.dto.GetUrlResponse;
import com.scaleshort.exception.UrlNotFoundException;
import com.scaleshort.repository.UrlRepository;
import com.scaleshort.util.CodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UrlShortenerService {
    
    private final UrlRepository urlRepository;
    private final CodeGenerator codeGenerator;
    private final CacheManager cacheManager;
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    @Value("${app.default-ttl-seconds:2592000}") // 30 days default
    private long defaultTtlSeconds;
    
    private static final int MAX_RETRY_ATTEMPTS = 10;
    
    public CreateUrlResponse createShortUrl(CreateUrlRequest request) {
        String longUrl = request.getLongUrl();
        long ttlSeconds = request.getTtlSeconds() != null ? request.getTtlSeconds() : defaultTtlSeconds;
        
        // Attempt to generate unique code with retries on collision
        String code = null;
        boolean saved = false;
        int attempts = 0;
        
        while (!saved && attempts < MAX_RETRY_ATTEMPTS) {
            code = codeGenerator.generateCode();
            saved = urlRepository.saveIfNotExists(code, longUrl, ttlSeconds);
            attempts++;
            
            if (!saved) {
                log.debug("Code collision detected for: {}, retrying... (attempt {})", code, attempts);
            }
        }
        
        if (!saved) {
            log.error("Failed to generate unique code after {} attempts", MAX_RETRY_ATTEMPTS);
            throw new RuntimeException("Unable to generate unique short code");
        }
        
        // Warm L1 cache with proper object type
        Cache cache = cacheManager.getCache("urls");
        if (cache != null) {
            GetUrlResponse cacheEntry = GetUrlResponse.builder()
                    .longUrl(longUrl)
                    .build();
            cache.put(code, cacheEntry);
            log.debug("Warmed L1 cache for code: {}", code);
        }
        
        String shortUrl = buildShortUrl(code);
        log.info("Created short URL: {} -> {}", shortUrl, longUrl);
        
        return CreateUrlResponse.builder()
                .code(code)
                .shortUrl(shortUrl)
                .build();
    }
    
    @Cacheable(value = "urls", key = "#code", unless = "#result == null")
    public GetUrlResponse getUrl(String code) {
        log.debug("Fetching URL for code: {}", code);
        
        // Validate code format
        if (!codeGenerator.isValidCode(code)) {
            log.warn("Invalid code format: {}", code);
            throw new UrlNotFoundException("Invalid short code format");
        }
        
        // L1 cache miss - fetch from Redis (L2)
        String longUrl = urlRepository.findByCode(code);
        
        if (longUrl == null) {
            log.warn("URL not found for code: {}", code);
            throw new UrlNotFoundException("Short URL not found or expired");
        }
        
        log.debug("Found URL for code {}: {}", code, longUrl);
        return GetUrlResponse.builder()
                .longUrl(longUrl)
                .build();
    }
    
    public String getLongUrlForRedirect(String code) {
        GetUrlResponse response = getUrl(code);
        return response.getLongUrl();
    }
    
    private String buildShortUrl(String code) {
        String url = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        return url + "r/" + code;
    }
}