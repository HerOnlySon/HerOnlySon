package com.cardoc.backend.repository;

import com.cardoc.backend.entity.CarEntity;
import com.cardoc.backend.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<CarEntity, Long> {
  List<CarEntity> findByUser(UserEntity user);
  Optional<CarEntity> findByIdAndUser(Long id, UserEntity user);
}
