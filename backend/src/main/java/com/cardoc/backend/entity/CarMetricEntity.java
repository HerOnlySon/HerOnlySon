package com.cardoc.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "car_metrics")
@Getter
@Setter
public class CarMetricEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "car_id", nullable = false)
  private CarEntity car;

  @Column(nullable = false)
  private Instant timestamp;

  @Column(nullable = false)
  private Integer rpm;

  @Column(nullable = false)
  private Double fuel;

  @Column(nullable = false)
  private Double battery;

  @Column(nullable = false)
  private Integer speed;

  @Column(nullable = false)
  private Integer coolantTemp;

  @Column(nullable = false)
  private String errorCodes;
}
