package com.cardoc.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
  public record SignUpRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    @NotBlank String password
  ) {}

  public record SignInRequest(
    @Email @NotBlank String email,
    @NotBlank String password
  ) {}

  public record AuthResponse(String token, String email, String name) {}
}
