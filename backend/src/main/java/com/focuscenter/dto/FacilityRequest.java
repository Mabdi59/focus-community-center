package com.focuscenter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FacilityRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Integer capacity;

    @NotNull
    private Double hourlyRate;

    @NotBlank
    private String type;

    private Boolean isAvailable = true;

    private String imageUrl;
}
