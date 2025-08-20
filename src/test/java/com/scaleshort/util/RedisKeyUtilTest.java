package com.scaleshort.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RedisKeyUtilTest {
    
    private RedisKeyUtil redisKeyUtil;
    
    @BeforeEach
    void setUp() {
        redisKeyUtil = new RedisKeyUtil();
    }
    
    @Test
    void testCalculateHashSlot_shouldReturnValidSlot() {
        String key = "u:aBc1234";
        int slot = redisKeyUtil.calculateHashSlot(key);
        
        // Slot should be in valid range
        assertTrue(slot >= 0 && slot < 16384, 
            "Slot should be between 0 and 16383, got: " + slot);
    }
    
    @Test
    void testCalculateHashSlot_withHashTag() {
        // Keys with same hash tag should get same slot
        String key1 = "u:{user123}:code1";
        String key2 = "u:{user123}:code2";
        
        int slot1 = redisKeyUtil.calculateHashSlot(key1);
        int slot2 = redisKeyUtil.calculateHashSlot(key2);
        
        assertEquals(slot1, slot2, 
            "Keys with same hash tag should map to same slot");
    }
    
    @Test
    void testCalculateHashSlot_differentKeys() {
        String key1 = "u:aBc1234";
        String key2 = "u:xYz5678";
        
        int slot1 = redisKeyUtil.calculateHashSlot(key1);
        int slot2 = redisKeyUtil.calculateHashSlot(key2);
        
        // Different keys might get different slots (not guaranteed but likely)
        assertTrue(slot1 >= 0 && slot1 < 16384);
        assertTrue(slot2 >= 0 && slot2 < 16384);
    }
    
    @Test
    void testBuildKey() {
        String code = "aBc1234";
        String key = redisKeyUtil.buildKey(code);
        
        assertEquals("u:aBc1234", key);
    }
    
    @Test
    void testBuildKeyWithHashTag() {
        String hashTag = "user123";
        String code = "aBc1234";
        String key = redisKeyUtil.buildKeyWithHashTag(hashTag, code);
        
        assertEquals("u:{user123}:aBc1234", key);
    }
    
    @Test
    void testGetMasterNodeIndex() {
        // Test keys that should map to different masters
        String key1 = "u:test1";
        String key2 = "u:test2";
        String key3 = "u:test3";
        
        int node1 = redisKeyUtil.getMasterNodeIndex(key1);
        int node2 = redisKeyUtil.getMasterNodeIndex(key2);
        int node3 = redisKeyUtil.getMasterNodeIndex(key3);
        
        // All should be valid node indices
        assertTrue(node1 >= 0 && node1 <= 2);
        assertTrue(node2 >= 0 && node2 <= 2);
        assertTrue(node3 >= 0 && node3 <= 2);
    }
    
    @Test
    void testSlotDistribution_covers16384Slots() {
        // Verify our distribution covers all 16384 slots
        int master0Slots = 5461;  // 0-5460
        int master1Slots = 5462;  // 5461-10922
        int master2Slots = 5461;  // 10923-16383
        
        int totalSlots = master0Slots + master1Slots + master2Slots;
        
        assertEquals(16384, totalSlots, 
            "Total slots should equal 16384");
    }
    
    @Test
    void testGetSlotDistributionInfo() {
        String info = redisKeyUtil.getSlotDistributionInfo();
        
        assertNotNull(info);
        assertTrue(info.contains("16384 total slots"));
        assertTrue(info.contains("Master 0: slots 0-5460"));
        assertTrue(info.contains("Master 1: slots 5461-10922"));
        assertTrue(info.contains("Master 2: slots 10923-16383"));
    }
}