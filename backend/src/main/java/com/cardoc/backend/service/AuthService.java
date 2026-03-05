package com.cardoc.backend.service;

import com.cardoc.backend.dto.AuthDtos;
import com.cardoc.backend.entity.UserEntity;
import com.cardoc.backend.repository.UserRepository;
import com.cardoc.backend.security.AppUserDetailsService;
import com.cardoc.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final AppUserDetailsService userDetailsService;
  private final JwtService jwtService;

  public AuthDtos.AuthResponse signUp(AuthDtos.SignUpRequest request) {
    userRepository.findByEmail(request.email()).ifPresent(existing -> {
      throw new IllegalArgumentException("Email already in use");
    });

    UserEntity user = new UserEntity();
    user.setName(request.name());
    user.setEmail(request.email().toLowerCase());
    user.setPassword(passwordEncoder.encode(request.password()));
    UserEntity saved = userRepository.save(user);

    String token = jwtService.generateToken(userDetailsService.loadUserByUsername(saved.getEmail()));
    return new AuthDtos.AuthResponse(token, saved.getEmail(), saved.getName());
  }

  public AuthDtos.AuthResponse signIn(AuthDtos.SignInRequest request) {
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
    );

    UserEntity user = userRepository.findByEmail(request.email().toLowerCase())
      .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

    String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
    return new AuthDtos.AuthResponse(token, user.getEmail(), user.getName());
  }
}
