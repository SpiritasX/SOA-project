package com.example.stakeholders.service;

import com.example.common.exception.BadRequestException;
import com.example.common.exception.NotFoundException;
import com.example.common.model.Status;
import com.example.stakeholders.model.User;
import com.example.stakeholders.repository.UserRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    public AdminService(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public void blockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getStatus().equals(Status.BLOCKED)) {
            throw new BadRequestException("User already blocked");
        }

        user.block();
        userRepository.save(user);

        rabbitTemplate.convertAndSend(
                "user.exchange",
                "user.blocked",
                user.getId()
        );
    }

    public void unblockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getStatus().equals(Status.ACTIVE)) {
            throw new BadRequestException("User already unblocked");
        }

        user.unblock();
        userRepository.save(user);

        rabbitTemplate.convertAndSend(
                "user.exchange",
                "user.unblocked",
                user.getId()
        );
    }
}
