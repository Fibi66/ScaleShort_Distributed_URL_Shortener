package com.scaleshort.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Instant;

@Component
public class CodeGenerator {
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int CODE_LENGTH = 7;
    private final SecureRandom random = new SecureRandom();
    
    public String generateCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        
        // Add timestamp component for uniqueness (3 chars)
        long timestamp = Instant.now().toEpochMilli();
        for (int i = 0; i < 3; i++) {
            code.append(BASE62_CHARS.charAt((int)(timestamp % 62)));
            timestamp /= 62;
        }
        
        // Add random component (4 chars)
        for (int i = 0; i < 4; i++) {
            code.append(BASE62_CHARS.charAt(random.nextInt(62)));
        }
        
        return code.toString();
    }
    
    public boolean isValidCode(String code) {
        if (code == null || code.length() != CODE_LENGTH) {
            return false;
        }
        
        for (char c : code.toCharArray()) {
            if (BASE62_CHARS.indexOf(c) == -1) {
                return false;
            }
        }
        
        return true;
    }
}