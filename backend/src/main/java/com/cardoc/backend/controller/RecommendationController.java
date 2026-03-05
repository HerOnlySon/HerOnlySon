package com.cardoc.backend.controller;

import com.cardoc.backend.dto.RecommendationDtos;
import com.cardoc.backend.service.RecommendationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendationController {
  private final RecommendationService recommendationService;

  @GetMapping("/insurance/{carId}/quotes")
  public ResponseEntity<List<RecommendationDtos.InsuranceQuoteResponse>> insuranceQuotes(@PathVariable Long carId) {
    return ResponseEntity.ok(recommendationService.getInsuranceQuotes(carId));
  }

  @GetMapping("/maintenance/{carId}/next-service")
  public ResponseEntity<RecommendationDtos.NextServiceResponse> nextService(@PathVariable Long carId) {
    return ResponseEntity.ok(recommendationService.getNextService(carId));
  }

  @GetMapping("/alerts/{carId}")
  public ResponseEntity<List<RecommendationDtos.AlertResponse>> alerts(@PathVariable Long carId) {
    return ResponseEntity.ok(recommendationService.getAlerts(carId));
  }

  @GetMapping("/ai/error-code/{code}")
  public ResponseEntity<RecommendationDtos.ErrorCodeExplanationResponse> explainCode(@PathVariable String code) {
    return ResponseEntity.ok(recommendationService.explainCode(code));
  }
}
