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
    void testCreateShortUrl_shouldReturnExistingCode() {
        // Given
        String longUrl = "https://example.com";
        String existingCode = "abc123";
        CreateUrlRequest request = new CreateUrlRequest(longUrl, null);

        when(urlRepository.findCodeByUrl(longUrl)).thenReturn(existingCode);

        // When
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);

        // Then
        assertNotNull(response);
        assertEquals(existingCode, response.getCode());
        assertEquals("http://localhost:8080/r/abc123", response.getShortUrl());
        verify(codeGenerator, never()).generateCode(anyString());
    }

    @Test
    void testCreateShortUrl_shouldCreateNewCode() {
        // Given
        String longUrl = "https://example.com";
        String generatedCode = "abc123";
        CreateUrlRequest request = new CreateUrlRequest(longUrl, null);

        when(urlRepository.findCodeByUrl(longUrl)).thenReturn(null);
        when(codeGenerator.generateCode(longUrl)).thenReturn(generatedCode);
        when(urlRepository.save(eq(generatedCode), eq(longUrl), eq(2592000L))).thenReturn(true);
        when(cacheManager.getCache("urls")).thenReturn(cache);

        // When
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);

        // Then
        assertNotNull(response);
        assertEquals(generatedCode, response.getCode());
        assertEquals("http://localhost:8080/r/abc123", response.getShortUrl());
    }

    @Test
    void testCreateShortUrl_shouldRetryOnCollision() {
        // Given
        String longUrl = "https://example.com";
        String firstCode = "abc123";
        String secondCode = "xyz789";
        CreateUrlRequest request = new CreateUrlRequest(longUrl, null);

        when(urlRepository.findCodeByUrl(longUrl)).thenReturn(null);
        when(codeGenerator.generateCode(longUrl)).thenReturn(firstCode);
        when(codeGenerator.generateCodeWithSalt(longUrl, 1)).thenReturn(secondCode);
        when(urlRepository.save(eq(firstCode), eq(longUrl), anyLong())).thenReturn(false);
        when(urlRepository.save(eq(secondCode), eq(longUrl), anyLong())).thenReturn(true);
        when(cacheManager.getCache("urls")).thenReturn(cache);

        // When
        CreateUrlResponse response = urlShortenerService.createShortUrl(request);

        // Then
        assertNotNull(response);
        assertEquals(secondCode, response.getCode());
    }

    @Test
    void testGetUrl_shouldReturnUrlWhenFound() {
        // Given
        String code = "abc123";
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
        String code = "abc123";

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
