package com.scaleshort.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class CodeGeneratorTest {
    
    private CodeGenerator codeGenerator;
    
    @BeforeEach
    void setUp() {
        codeGenerator = new CodeGenerator();
    }
    
    @Test
    void testGenerateCode_shouldReturnValidBase62Code() {
        String code = codeGenerator.generateCode();
        
        assertNotNull(code);
        assertEquals(7, code.length());
        assertTrue(code.matches("[0-9A-Za-z]+"));
    }
    
    @Test
    void testGenerateCode_shouldGenerateUniqueCodesWithHighProbability() {
        Set<String> codes = new HashSet<>();
        int iterations = 10000;
        
        for (int i = 0; i < iterations; i++) {
            codes.add(codeGenerator.generateCode());
        }
        
        // Should have very high uniqueness (allowing for small collision possibility)
        assertTrue(codes.size() > iterations * 0.99);
    }
    
    @Test
    void testIsValidCode_shouldReturnTrueForValidCode() {
        String validCode = "aBc1234";
        assertTrue(codeGenerator.isValidCode(validCode));
    }
    
    @Test
    void testIsValidCode_shouldReturnFalseForInvalidLength() {
        assertFalse(codeGenerator.isValidCode("abc"));
        assertFalse(codeGenerator.isValidCode("abc12345"));
    }
    
    @Test
    void testIsValidCode_shouldReturnFalseForInvalidCharacters() {
        assertFalse(codeGenerator.isValidCode("abc@123"));
        assertFalse(codeGenerator.isValidCode("abc-123"));
        assertFalse(codeGenerator.isValidCode("abc_123"));
    }
    
    @Test
    void testIsValidCode_shouldReturnFalseForNull() {
        assertFalse(codeGenerator.isValidCode(null));
    }
}