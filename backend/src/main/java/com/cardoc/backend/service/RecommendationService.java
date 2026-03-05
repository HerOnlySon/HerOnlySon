package com.cardoc.backend.service;

import com.cardoc.backend.dto.RecommendationDtos;
import com.cardoc.backend.entity.AlertEntity;
import com.cardoc.backend.entity.CarEntity;
import com.cardoc.backend.entity.InsuranceQuoteEntity;
import com.cardoc.backend.repository.AlertRepository;
import com.cardoc.backend.repository.InsuranceQuoteRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {
  private final CarService carService;
  private final MetricService metricService;
  private final InsuranceQuoteRepository insuranceQuoteRepository;
  private final AlertRepository alertRepository;

  public List<RecommendationDtos.InsuranceQuoteResponse> getInsuranceQuotes(Long carId) {
    CarEntity car = carService.requireOwnedCar(carId);
    var latest = metricService.getLatest(carId);

    int risk = 45;
    if (latest != null) {
      risk += latest.rpm() > 2800 ? 12 : 4;
      risk += latest.fuel() < 20 ? 8 : 2;
      risk += latest.battery() < 55 ? 10 : 2;
      risk += latest.errorCodes().size() * 6;
    }
    risk = Math.min(95, Math.max(15, risk));

    List<InsuranceQuoteEntity> quotes = List.of(
      createQuote(car, "OUTsurance", 1200 + risk * 8, risk + 3),
      createQuote(car, "Discovery Insure", 1050 + risk * 7, risk),
      createQuote(car, "Hollard", 980 + risk * 6, Math.max(10, risk - 4))
    );

    insuranceQuoteRepository.saveAll(quotes);

    return quotes.stream()
      .map(q -> new RecommendationDtos.InsuranceQuoteResponse(q.getProvider(), q.getMonthlyPrice(), q.getRiskScore()))
      .toList();
  }

  public RecommendationDtos.NextServiceResponse getNextService(Long carId) {
    CarEntity car = carService.requireOwnedCar(carId);
    int nextServiceMileage = car.getLastServiceMileage() + car.getServiceIntervalKm();
    int dueInKm = nextServiceMileage - car.getMileage();
    boolean dueNow = dueInKm <= 0;
    String recommendation = dueNow
      ? "Service is due now. Book a workshop this week."
      : dueInKm <= 1500
        ? "Service is approaching. Plan a booking soon."
        : "Service schedule is healthy.";

    return new RecommendationDtos.NextServiceResponse(
      car.getMileage(),
      nextServiceMileage,
      dueInKm,
      dueNow,
      recommendation
    );
  }

  public List<RecommendationDtos.AlertResponse> getAlerts(Long carId) {
    CarEntity car = carService.requireOwnedCar(carId);
    return alertRepository.findTop20ByCarOrderByCreatedAtDesc(car).stream()
      .map(a -> new RecommendationDtos.AlertResponse(a.getMaintenanceType(), a.getSeverity(), a.getStatus(), a.getMessage(), a.getCreatedAt()))
      .toList();
  }

  public RecommendationDtos.ErrorCodeExplanationResponse explainCode(String code) {
    String explanation = switch (code.toUpperCase()) {
      case "P0171" -> "Mixture is too lean. Check intake leaks and fuel delivery.";
      case "P0300" -> "Random misfires detected. Inspect spark plugs, coils, and injector balance.";
      case "P0420" -> "Catalyst efficiency is below threshold. Exhaust and catalytic converter should be checked.";
      case "P0456" -> "Small EVAP leak. Inspect fuel cap and vapor lines.";
      default -> "Unknown code. Use a full workshop diagnostic for a precise cause.";
    };
    return new RecommendationDtos.ErrorCodeExplanationResponse(code.toUpperCase(), explanation);
  }

  public void createServiceDueAlert(CarEntity car, int dueInKm) {
    AlertEntity alert = new AlertEntity();
    alert.setCar(car);
    alert.setMaintenanceType("Scheduled Service");
    alert.setSeverity(dueInKm <= 0 ? "High" : "Medium");
    alert.setStatus("Open");
    alert.setMessage(dueInKm <= 0
      ? "Vehicle service is overdue. Book immediately."
      : "Vehicle service is due soon. Book within the next 1,500 km.");
    alert.setCreatedAt(Instant.now());
    alertRepository.save(alert);
  }

  private InsuranceQuoteEntity createQuote(CarEntity car, String provider, int monthly, int riskScore) {
    InsuranceQuoteEntity quote = new InsuranceQuoteEntity();
    quote.setCar(car);
    quote.setProvider(provider);
    quote.setMonthlyPrice(monthly);
    quote.setRiskScore(Math.min(99, Math.max(10, riskScore)));
    quote.setCreatedAt(Instant.now());
    return quote;
  }
}
