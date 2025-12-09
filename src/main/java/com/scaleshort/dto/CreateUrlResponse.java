package com.scaleshort.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlResponse {
    @JsonProperty("code")
    private String code;
    
    @JsonProperty("shortUrl")
    private String shortUrl;
}