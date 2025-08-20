package com.scaleshort.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlRequest {
    @NotBlank(message = "Long URL is required")
    @URL(message = "Invalid URL format")
    @JsonProperty("longUrl")
    private String longUrl;
    
    @Positive(message = "TTL must be positive")
    @JsonProperty("ttlSeconds")
    private Integer ttlSeconds;
}