package com.cardoc.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CarDocBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(CarDocBackendApplication.class, args);
  }
}
