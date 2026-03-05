package com.cardoc.backend.controller;

import com.cardoc.backend.dto.AuthDtos;
import com.cardoc.backend.service.AuthService;
import com.cardoc.backend.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;
  private final CurrentUserService currentUserService;

  @PostMapping("/signup")
  public ResponseEntity<AuthDtos.AuthResponse> signup(@Valid @RequestBody AuthDtos.SignUpRequest request) {
    return ResponseEntity.ok(authService.signUp(request));
  }

  @PostMapping("/signin")
  public ResponseEntity<AuthDtos.AuthResponse> signin(@Valid @RequestBody AuthDtos.SignInRequest request) {
    return ResponseEntity.ok(authService.signIn(request));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var user = currentUserService.requireUser();
    return ResponseEntity.ok(new AuthDtos.AuthResponse("", user.getEmail(), user.getName()));
  }
}
