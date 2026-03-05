package com.cardoc.backend.repository;

import com.cardoc.backend.entity.CarEntity;
import com.cardoc.backend.entity.CarMetricEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarMetricRepository extends JpaRepository<CarMetricEntity, Long> {
  List<CarMetricEntity> findTop50ByCarOrderByTimestampDesc(CarEntity car);
  CarMetricEntity findTopByCarOrderByTimestampDesc(CarEntity car);
}
