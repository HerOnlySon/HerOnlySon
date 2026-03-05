package com.cardoc.backend.controller;

import com.cardoc.backend.dto.CarDtos;
import com.cardoc.backend.service.CarService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
  private final CarService carService;

  @PostMapping
  public ResponseEntity<CarDtos.CarResponse> create(@Valid @RequestBody CarDtos.CarRequest request) {
    return ResponseEntity.ok(carService.createCar(request));
  }

  @GetMapping("/me")
  public ResponseEntity<List<CarDtos.CarResponse>> myCars() {
    return ResponseEntity.ok(carService.getMyCars());
  }

  @PutMapping("/{id}")
  public ResponseEntity<CarDtos.CarResponse> update(@PathVariable Long id, @Valid @RequestBody CarDtos.CarRequest request) {
    return ResponseEntity.ok(carService.updateCar(id, request));
  }
}
