package com.example.auth.config;

import com.example.auth.model.User;
import com.example.auth.repository.AuthRepository;
import com.example.common.model.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    public AdminSeeder(AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (authRepository.findByUsername(adminUsername).isPresent()) {
            return;
        }

        User admin = new User(
                adminUsername,
                passwordEncoder.encode(adminPassword),
                adminEmail,
                Role.ADMINISTRATOR
        );

        authRepository.save(admin);
    }
}
