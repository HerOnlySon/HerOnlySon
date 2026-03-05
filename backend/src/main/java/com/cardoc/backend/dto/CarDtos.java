package com.cardoc.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CarDtos {
  public record CarRequest(
    @NotBlank String make,
    @NotBlank String model,
    @NotNull @Min(1990) @Max(2100) Integer year,
    @NotNull @Min(0) Integer mileage,
    Integer lastServiceMileage,
    Integer serviceIntervalKm
  ) {}

  public record CarResponse(
    Long id,
    String make,
    String model,
    Integer year,
    Integer mileage,
    Integer lastServiceMileage,
    Integer serviceIntervalKm
  ) {}
}
