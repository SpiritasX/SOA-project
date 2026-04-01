package com.auth.service;

import com.auth.dto.LoginRequest;
import com.auth.dto.RegisterRequest;
import com.auth.dto.UserRegisteredEvent;
import com.auth.exception.BadRequestException;
import com.auth.exception.ForbiddenException;
import com.auth.exception.NotFoundException;
import com.auth.model.Role;
import com.auth.model.User;
import com.auth.repository.AuthRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitTemplate rabbitTemplate;

    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder, RabbitTemplate rabbitTemplate) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.rabbitTemplate = rabbitTemplate;
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

        rabbitTemplate.convertAndSend(
                "user.exchange",
                "user.registered",
                new UserRegisteredEvent(user.getId(), request.getFirstName(), request.getLastName(), user.getRole())
        );
    }

    public boolean login(LoginRequest request) {
        User user = authRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("User not found"));
        return passwordEncoder.matches(request.getPassword(), user.getPassword());
    }

    @RabbitListener(queues = "user.blocked.auth.queue")
    public void handleUserBlockedEvent(Long userId) {
        User user = authRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.block();
        authRepository.save(user);
    }

    @RabbitListener(queues = "user.unblocked.auth.queue")
    public void handleUserUnblockedEvent(Long userId) {
        User user = authRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.unblock();
        authRepository.save(user);
    }
}
