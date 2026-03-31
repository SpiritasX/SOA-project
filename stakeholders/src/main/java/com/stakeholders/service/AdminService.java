package com.stakeholders.service;

import com.stakeholders.exception.BadRequestException;
import com.stakeholders.exception.NotFoundException;
import com.stakeholders.model.Status;
import com.stakeholders.model.User;
import com.stakeholders.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void blockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getStatus().equals(Status.BLOCKED)) {
            throw new BadRequestException("User already blocked");
        }

        user.block();
        userRepository.save(user);
    }

    public void unblockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getStatus().equals(Status.ACTIVE)) {
            throw new BadRequestException("User already unblocked");
        }

        user.unblock();
        userRepository.save(user);
    }
}
