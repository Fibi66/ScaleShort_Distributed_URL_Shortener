package com.scaleshort.controller;

import com.scaleshort.dto.CreateUrlRequest;
import com.scaleshort.dto.CreateUrlResponse;
import com.scaleshort.dto.GetUrlResponse;
import com.scaleshort.service.RateLimitService;
import com.scaleshort.service.UrlShortenerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UrlController {
    
    private final UrlShortenerService urlShortenerService;
    private final RateLimitService rateLimitService;
    
    @PostMapping("/api/v1/urls")
    public ResponseEntity<CreateUrlResponse> createShortUrl(
            @Valid @RequestBody CreateUrlRequest request,
            HttpServletRequest httpRequest) {
        
        // Rate limiting check
        String clientIp = getClientIp(httpRequest);
        if (!rateLimitService.tryConsume(clientIp)) {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }
        
        log.info("Creating short URL for: {}", request.getLongUrl());
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/api/v1/urls/{code}")
    public ResponseEntity<GetUrlResponse> getUrl(@PathVariable String code) {
        log.info("Retrieving URL for code: {}", code);
        GetUrlResponse response = urlShortenerService.getUrl(code);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/r/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        log.info("Redirecting for code: {}", code);
        String longUrl = urlShortenerService.getLongUrlForRedirect(code);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", longUrl)
                .build();
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}