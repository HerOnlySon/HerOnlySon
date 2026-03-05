package com.cardoc.backend.service;

import com.cardoc.backend.dto.CarDtos;
import com.cardoc.backend.entity.CarEntity;
import com.cardoc.backend.repository.CarRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarService {
  private final CarRepository carRepository;
  private final CurrentUserService currentUserService;

  public CarDtos.CarResponse createCar(CarDtos.CarRequest request) {
    CarEntity car = new CarEntity();
    car.setUser(currentUserService.requireUser());
    mapRequest(car, request);
    return toResponse(carRepository.save(car));
  }

  public List<CarDtos.CarResponse> getMyCars() {
    return carRepository.findByUser(currentUserService.requireUser()).stream().map(this::toResponse).toList();
  }

  public CarDtos.CarResponse updateCar(Long carId, CarDtos.CarRequest request) {
    CarEntity car = carRepository.findByIdAndUser(carId, currentUserService.requireUser())
      .orElseThrow(() -> new IllegalArgumentException("Car not found"));
    mapRequest(car, request);
    return toResponse(carRepository.save(car));
  }

  public CarEntity requireOwnedCar(Long carId) {
    return carRepository.findByIdAndUser(carId, currentUserService.requireUser())
      .orElseThrow(() -> new IllegalArgumentException("Car not found"));
  }

  private void mapRequest(CarEntity car, CarDtos.CarRequest request) {
    car.setMake(request.make());
    car.setModel(request.model());
    car.setYear(request.year());
    car.setMileage(request.mileage());
    car.setLastServiceMileage(request.lastServiceMileage() != null ? request.lastServiceMileage() : request.mileage());
    car.setServiceIntervalKm(request.serviceIntervalKm() != null ? request.serviceIntervalKm() : 10000);
  }

  private CarDtos.CarResponse toResponse(CarEntity car) {
    return new CarDtos.CarResponse(
      car.getId(),
      car.getMake(),
      car.getModel(),
      car.getYear(),
      car.getMileage(),
      car.getLastServiceMileage(),
      car.getServiceIntervalKm()
    );
  }
}
