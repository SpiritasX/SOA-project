package com.example.blog.service;

import com.example.blog.dto.UserRegisteredEvent;
import com.example.common.exception.NotFoundException;
import com.example.blog.model.User;
import com.example.blog.repository.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RabbitListener(queues = "user.blocked.blog.queue")
    public void handleUserBlockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.block();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.unblocked.blog.queue")
    public void handleUserUnblockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.unblock();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.registered.blog.queue")
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = new User(
                event.getId(),
                event.getRole()
        );
        userRepository.save(user);
    }
}
