package com.scaleshort.service;

import com.scaleshort.dto.CreateUrlRequest;
import com.scaleshort.dto.CreateUrlResponse;
import com.scaleshort.dto.GetUrlResponse;
import com.scaleshort.exception.UrlNotFoundException;
import com.scaleshort.repository.UrlRepository;
import com.scaleshort.util.CodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlShortenerServiceTest {
    
    @Mock
    private UrlRepository urlRepository;
    
    @Mock
    private CodeGenerator codeGenerator;
    
    @Mock
    private CacheManager cacheManager;
    
    @Mock
    private Cache cache;
    
    @InjectMocks
    private UrlShortenerService urlShortenerService;
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(urlShortenerService, "baseUrl", "http://localhost:8080");
        ReflectionTestUtils.setField(urlShortenerService, "defaultTtlSeconds", 2592000L);
    }
    
    @Test
    void testCreateShortUrl_shouldCreateSuccessfully() {
        // Given
        CreateUrlRequest request = new CreateUrlRequest("https://example.com", null);
        String generatedCode = "abc1234";
        
        when(codeGenerator.generateCode()).thenReturn(generatedCode);
        when(urlRepository.saveIfNotExists(eq(generatedCode), eq("https://example.com"), eq(2592000L)))
                .thenReturn(true);
        when(cacheManager.getCache("urls")).thenReturn(cache);
        
        // When
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);
        
        // Then
        assertNotNull(response);
        assertEquals(generatedCode, response.getCode());
        assertEquals("http://localhost:8080/r/abc1234", response.getShortUrl());
        verify(cache).put(generatedCode, "https://example.com");
    }
    
    @Test
    void testCreateShortUrl_shouldRetryOnCollision() {
        // Given
        CreateUrlRequest request = new CreateUrlRequest("https://example.com", 3600);
        String firstCode = "abc1234";
        String secondCode = "xyz5678";
        
        when(codeGenerator.generateCode())
                .thenReturn(firstCode)
                .thenReturn(secondCode);
        when(urlRepository.saveIfNotExists(eq(firstCode), anyString(), anyLong()))
                .thenReturn(false);
        when(urlRepository.saveIfNotExists(eq(secondCode), anyString(), anyLong()))
                .thenReturn(true);
        when(cacheManager.getCache("urls")).thenReturn(cache);
        
        // When
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);
        
        // Then
        assertNotNull(response);
        assertEquals(secondCode, response.getCode());
        verify(codeGenerator, times(2)).generateCode();
    }
    
    @Test
    void testGetUrl_shouldReturnUrlWhenFound() {
        // Given
        String code = "abc1234";
        String longUrl = "https://example.com";
        
        when(codeGenerator.isValidCode(code)).thenReturn(true);
        when(urlRepository.findByCode(code)).thenReturn(longUrl);
        
        // When
        GetUrlResponse response = urlShortenerService.getUrl(code);
        
        // Then
        assertNotNull(response);
        assertEquals(longUrl, response.getLongUrl());
    }
    
    @Test
    void testGetUrl_shouldThrowExceptionWhenNotFound() {
        // Given
        String code = "abc1234";
        
        when(codeGenerator.isValidCode(code)).thenReturn(true);
        when(urlRepository.findByCode(code)).thenReturn(null);
        
        // When & Then
        assertThrows(UrlNotFoundException.class, () -> urlShortenerService.getUrl(code));
    }
    
    @Test
    void testGetUrl_shouldThrowExceptionForInvalidCode() {
        // Given
        String code = "invalid";
        
        when(codeGenerator.isValidCode(code)).thenReturn(false);
        
        // When & Then
        assertThrows(UrlNotFoundException.class, () -> urlShortenerService.getUrl(code));
    }
}