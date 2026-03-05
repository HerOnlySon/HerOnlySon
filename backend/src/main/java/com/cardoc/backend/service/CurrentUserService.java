package com.cardoc.backend.service;

import com.cardoc.backend.entity.UserEntity;
import com.cardoc.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {
  private final UserRepository userRepository;

  public UserEntity requireUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
      .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
  }
}
