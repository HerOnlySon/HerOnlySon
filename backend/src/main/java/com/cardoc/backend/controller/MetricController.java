package com.cardoc.backend.controller;

import com.cardoc.backend.dto.MetricDtos;
import com.cardoc.backend.service.MetricService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricController {
  private final MetricService metricService;

  @PostMapping("/ingest")
  public ResponseEntity<MetricDtos.MetricResponse> ingest(@Valid @RequestBody MetricDtos.MetricIngestRequest request) {
    return ResponseEntity.ok(metricService.ingest(request));
  }

  @GetMapping("/{carId}/latest")
  public ResponseEntity<MetricDtos.MetricResponse> latest(@PathVariable Long carId) {
    return ResponseEntity.ok(metricService.getLatest(carId));
  }

  @GetMapping("/{carId}/history")
  public ResponseEntity<List<MetricDtos.MetricResponse>> history(@PathVariable Long carId) {
    return ResponseEntity.ok(metricService.getHistory(carId));
  }
}
