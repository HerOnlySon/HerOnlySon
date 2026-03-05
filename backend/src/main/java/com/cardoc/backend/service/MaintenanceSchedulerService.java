package com.cardoc.backend.service;

import com.cardoc.backend.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaintenanceSchedulerService {
  private final CarRepository carRepository;
  private final RecommendationService recommendationService;

  @Scheduled(cron = "0 0 */6 * * *")
  public void generateServiceAlerts() {
    carRepository.findAll().forEach(car -> {
      int next = car.getLastServiceMileage() + car.getServiceIntervalKm();
      int dueInKm = next - car.getMileage();
      if (dueInKm <= 1500) {
        recommendationService.createServiceDueAlert(car, dueInKm);
      }
    });
  }
}
