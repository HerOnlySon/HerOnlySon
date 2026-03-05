package com.cardoc.backend.service;

import com.cardoc.backend.dto.MetricDtos;
import com.cardoc.backend.entity.CarMetricEntity;
import com.cardoc.backend.repository.CarMetricRepository;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetricService {
  private final CarService carService;
  private final CarMetricRepository carMetricRepository;

  public MetricDtos.MetricResponse ingest(MetricDtos.MetricIngestRequest request) {
    var car = carService.requireOwnedCar(request.carId());

    CarMetricEntity entity = new CarMetricEntity();
    entity.setCar(car);
    entity.setTimestamp(Instant.now());
    entity.setRpm(request.rpm());
    entity.setFuel(request.fuel());
    entity.setBattery(request.battery());
    entity.setSpeed(request.speed());
    entity.setCoolantTemp(request.coolantTemp());
    entity.setErrorCodes(String.join(",", request.errorCodes() == null ? List.of() : request.errorCodes()));

    car.setMileage(car.getMileage() + Math.max(1, request.speed() / 60));

    CarMetricEntity saved = carMetricRepository.save(entity);
    return toResponse(saved);
  }

  public MetricDtos.MetricResponse getLatest(Long carId) {
    var car = carService.requireOwnedCar(carId);
    CarMetricEntity latest = carMetricRepository.findTopByCarOrderByTimestampDesc(car);
    if (latest == null) {
      return null;
    }
    return toResponse(latest);
  }

  public List<MetricDtos.MetricResponse> getHistory(Long carId) {
    var car = carService.requireOwnedCar(carId);
    return carMetricRepository.findTop50ByCarOrderByTimestampDesc(car).stream().map(this::toResponse).toList();
  }

  private MetricDtos.MetricResponse toResponse(CarMetricEntity entity) {
    List<String> codes = entity.getErrorCodes() == null || entity.getErrorCodes().isBlank()
      ? List.of()
      : Arrays.stream(entity.getErrorCodes().split(",")).toList();

    return new MetricDtos.MetricResponse(
      entity.getTimestamp(),
      entity.getRpm(),
      entity.getFuel(),
      entity.getBattery(),
      entity.getSpeed(),
      entity.getCoolantTemp(),
      codes
    );
  }
}
