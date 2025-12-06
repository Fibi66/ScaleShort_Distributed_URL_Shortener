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
        String code = codeGenerator.generateCode("https://example.com");

        assertNotNull(code);
        assertEquals(6, code.length());
        assertTrue(code.matches("[0-9A-Za-z]+"));
    }

    @Test
    void testGenerateCode_sameUrlShouldGenerateSameCode() {
        String url = "https://example.com";
        String code1 = codeGenerator.generateCode(url);
        String code2 = codeGenerator.generateCode(url);

        assertEquals(code1, code2);
    }

    @Test
    void testGenerateCode_differentUrlsShouldGenerateDifferentCodes() {
        String code1 = codeGenerator.generateCode("https://example.com");
        String code2 = codeGenerator.generateCode("https://google.com");

        assertNotEquals(code1, code2);
    }

    @Test
    void testGenerateCodeWithSalt_shouldGenerateDifferentCode() {
        String url = "https://example.com";
        String code1 = codeGenerator.generateCode(url);
        String code2 = codeGenerator.generateCodeWithSalt(url, 1);

        assertNotEquals(code1, code2);
    }

    @Test
    void testGenerateRandomCode_shouldReturnValidCode() {
        String code = codeGenerator.generateRandomCode();

        assertNotNull(code);
        assertEquals(6, code.length());
        assertTrue(code.matches("[0-9A-Za-z]+"));
    }

    @Test
    void testIsValidCode_shouldReturnTrueForValidCode() {
        String validCode = "aBc123";
        assertTrue(codeGenerator.isValidCode(validCode));
    }

    @Test
    void testIsValidCode_shouldReturnFalseForInvalidLength() {
        assertFalse(codeGenerator.isValidCode("abc"));
        assertFalse(codeGenerator.isValidCode("abc12345"));
    }

    @Test
    void testIsValidCode_shouldReturnFalseForInvalidCharacters() {
        assertFalse(codeGenerator.isValidCode("abc@12"));
        assertFalse(codeGenerator.isValidCode("abc-12"));
    }

    @Test
    void testIsValidCode_shouldReturnFalseForNull() {
        assertFalse(codeGenerator.isValidCode(null));
    }
}
