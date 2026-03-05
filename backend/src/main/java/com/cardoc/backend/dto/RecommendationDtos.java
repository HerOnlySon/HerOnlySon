package com.cardoc.backend.dto;

import java.time.Instant;

public class RecommendationDtos {
  public record InsuranceQuoteResponse(String provider, Integer monthlyPrice, Integer riskScore) {}

  public record AlertResponse(String maintenanceType, String severity, String status, String message, Instant createdAt) {}

  public record NextServiceResponse(
    Integer currentMileage,
    Integer nextServiceMileage,
    Integer dueInKm,
    boolean serviceDueNow,
    String recommendation
  ) {}

  public record ErrorCodeExplanationResponse(String code, String explanation) {}
}
