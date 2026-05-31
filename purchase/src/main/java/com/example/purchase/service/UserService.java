package com.example.purchase.service;

import com.example.common.exception.NotFoundException;
import com.example.common.model.Status;
import com.example.purchase.dto.UserRegisteredEvent;
import com.example.purchase.model.User;
import com.example.purchase.repository.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RabbitListener(queues = "user.blocked.purchase.queue")
    public void handleUserBlockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.block();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.unblocked.purchase.queue")
    public void handleUserUnblockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.unblock();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.registered.purchase.queue")
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = new User(
                event.getId(),
                event.getFirstName(),
                event.getLastName(),
                event.getRole(),
                Status.ACTIVE
        );
        userRepository.save(user);
    }
}
