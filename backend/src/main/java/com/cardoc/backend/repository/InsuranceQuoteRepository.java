package com.cardoc.backend.repository;

import com.cardoc.backend.entity.CarEntity;
import com.cardoc.backend.entity.InsuranceQuoteEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceQuoteRepository extends JpaRepository<InsuranceQuoteEntity, Long> {
  List<InsuranceQuoteEntity> findTop10ByCarOrderByCreatedAtDesc(CarEntity car);
}
