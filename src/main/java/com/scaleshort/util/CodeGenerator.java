package com.scaleshort.util;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

@Component
public class CodeGenerator {
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    /**
     * 根据 URL 生成短码（MurmurHash 风格，取 SHA-256 前 6 位 Base62）
     */
    public String generateCode(String url) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(url.getBytes(StandardCharsets.UTF_8));
            return toBase62(hash, CODE_LENGTH);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    /**
     * 哈希冲突时，加盐重新生成
     */
    public String generateCodeWithSalt(String url, int attempt) {
        return generateCode(url + "#" + attempt);
    }

    /**
     * 兜底：纯随机生成
     */
    public String generateRandomCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
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

    private String toBase62(byte[] bytes, int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int val = Byte.toUnsignedInt(bytes[i]) % 62;
            sb.append(BASE62_CHARS.charAt(val));
        }
        return sb.toString();
    }
}