package com.scaleshort.util;

import org.springframework.stereotype.Component;

/**
 * Utility class for Redis key operations and slot calculation.
 * Redis Cluster uses 16,384 hash slots (0-16383).
 */
@Component
public class RedisKeyUtil {
    
    private static final int REDIS_CLUSTER_SLOTS = 16384;
    private static final String KEY_PREFIX = "u:";
    
    /**
     * Calculate the hash slot for a given key.
     * This uses a simplified CRC16 calculation for demonstration.
     * In production, Redis handles this automatically.
     * 
     * @param key The Redis key
     * @return The hash slot number (0-16383)
     */
    public int calculateHashSlot(String key) {
        // Extract hash tag if present
        String hashKey = extractHashTag(key);
        
        // Simplified hash calculation (Redis uses CRC16)
        // This is for demonstration - actual slot calculation is done by Redis
        int hash = 0;
        for (char c : hashKey.toCharArray()) {
            hash = (hash * 31 + c) & 0xFFFF;
        }
        
        return Math.abs(hash) % REDIS_CLUSTER_SLOTS;
    }
    
    /**
     * Build a Redis key for a URL code.
     * 
     * @param code The short code
     * @return The full Redis key
     */
    public String buildKey(String code) {
        return KEY_PREFIX + code;
    }
    
    /**
     * Build a Redis key with hash tag for multi-key operations.
     * Keys with the same hash tag will be in the same slot.
     * 
     * @param hashTag The hash tag to ensure same-slot storage
     * @param code The short code
     * @return The full Redis key with hash tag
     */
    public String buildKeyWithHashTag(String hashTag, String code) {
        return KEY_PREFIX + "{" + hashTag + "}:" + code;
    }
    
    /**
     * Extract hash tag from a key if present.
     * Hash tags are defined by {} brackets in Redis.
     * 
     * @param key The Redis key
     * @return The hash tag content or the full key if no tag
     */
    private String extractHashTag(String key) {
        int start = key.indexOf('{');
        if (start != -1) {
            int end = key.indexOf('}', start);
            if (end != -1 && end > start + 1) {
                return key.substring(start + 1, end);
            }
        }
        return key;
    }
    
    /**
     * Get information about which master node (0-2) would handle this key
     * based on default 3-master setup with even distribution.
     * 
     * @param key The Redis key
     * @return The master node index (0, 1, or 2)
     */
    public int getMasterNodeIndex(String key) {
        int slot = calculateHashSlot(key);
        
        // Default distribution for 3 masters:
        // Master 0: slots 0-5460
        // Master 1: slots 5461-10922
        // Master 2: slots 10923-16383
        
        if (slot <= 5460) {
            return 0;
        } else if (slot <= 10922) {
            return 1;
        } else {
            return 2;
        }
    }
    
    /**
     * Get slot range information as a string.
     * 
     * @return Description of slot distribution
     */
    public String getSlotDistributionInfo() {
        return String.format(
            "Redis Cluster: %d total slots\n" +
            "Master 0: slots 0-5460 (5461 slots)\n" +
            "Master 1: slots 5461-10922 (5462 slots)\n" +
            "Master 2: slots 10923-16383 (5461 slots)",
            REDIS_CLUSTER_SLOTS
        );
    }
}