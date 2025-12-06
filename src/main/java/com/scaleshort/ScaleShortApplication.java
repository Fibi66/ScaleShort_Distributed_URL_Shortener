package com.scaleshort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ScaleShortApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScaleShortApplication.class, args);
    }
}