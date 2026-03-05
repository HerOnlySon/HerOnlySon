package com.cardoc.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

public class MetricDtos {
  public record MetricIngestRequest(
    @NotNull Long carId,
    @NotNull @Min(600) @Max(9000) Integer rpm,
    @NotNull @Min(0) @Max(100) Double fuel,
    @NotNull @Min(0) @Max(100) Double battery,
    @NotNull @Min(0) @Max(260) Integer speed,
    @NotNull @Min(0) @Max(150) Integer coolantTemp,
    List<String> errorCodes
  ) {}

  public record MetricResponse(
    Instant timestamp,
    Integer rpm,
    Double fuel,
    Double battery,
    Integer speed,
    Integer coolantTemp,
    List<String> errorCodes
  ) {}
}
