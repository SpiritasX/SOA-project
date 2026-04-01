package com.blog.service;

import com.blog.dto.UserRegisteredEvent;
import com.blog.exception.NotFoundException;
import com.blog.model.User;
import com.blog.repository.UserRepository;
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
