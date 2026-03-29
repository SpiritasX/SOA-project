package com.auth.service;

import com.auth.dto.LoginRequest;
import com.auth.dto.RegisterRequest;
import com.auth.exception.BadRequestException;
import com.auth.exception.ForbiddenException;
import com.auth.exception.NotFoundException;
import com.auth.model.Role;
import com.auth.model.User;
import com.auth.repository.AuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {
        if (authRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username already taken");
        }

        if (authRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already taken");
        }

        if (request.getRole().equals(Role.ADMINISTRATOR)) {
            throw new ForbiddenException("Cannot create admin user");
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                request.getRole()
        );

        authRepository.save(user);
    }

    public boolean login(LoginRequest request) {
        User user = authRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("User not found"));
        return passwordEncoder.matches(request.getPassword(), user.getPassword());
    }
}
