package com.example.tour.service;

import com.example.common.model.Status;
import com.example.tour.dto.UserRegisteredEvent;
import com.example.tour.model.User;
import com.example.tour.repository.UserRepository;
import com.example.common.exception.NotFoundException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RabbitListener(queues = "user.blocked.tour.queue")
    public void handleUserBlockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.block();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.unblocked.tour.queue")
    public void handleUserUnblockedEvent(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        user.unblock();
        userRepository.save(user);
    }

    @RabbitListener(queues = "user.registered.tour.queue")
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
