package com.cardoc.backend.repository;

import com.cardoc.backend.entity.AlertEntity;
import com.cardoc.backend.entity.CarEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<AlertEntity, Long> {
  List<AlertEntity> findTop20ByCarOrderByCreatedAtDesc(CarEntity car);
}
