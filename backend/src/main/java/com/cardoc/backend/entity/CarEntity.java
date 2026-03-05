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
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cars")
@Getter
@Setter
public class CarEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(nullable = false)
  private String make;

  @Column(nullable = false)
  private String model;

  @Column(nullable = false)
  private Integer year;

  @Column(nullable = false)
  private Integer mileage;

  @Column(nullable = false)
  private Integer lastServiceMileage = 0;

  @Column(nullable = false)
  private Integer serviceIntervalKm = 10000;
}
