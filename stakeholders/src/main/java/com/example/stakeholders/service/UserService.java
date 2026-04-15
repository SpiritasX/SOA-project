package com.example.stakeholders.service;

import com.example.stakeholders.dto.DetailViewDTO;
import com.example.stakeholders.dto.ListViewDTO;
import com.example.stakeholders.dto.UpdateDTO;
import com.example.stakeholders.dto.UserRegisteredEvent;
import com.example.common.exception.NotFoundException;
import com.example.stakeholders.model.User;
import com.example.stakeholders.repository.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public DetailViewDTO getUser(Long id) {
        User user =  userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        return new DetailViewDTO(user);
    }

    public Page<ListViewDTO> getUsers(int page, int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Page and size must be positive");
        }

        return userRepository.findAll(PageRequest.of(page, size)).map(ListViewDTO::new);
    }

    // TODO what about blocked users?
    public void updateUser(Long id, UpdateDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }

        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }

        // TODO this shouldn't be this simple
        if (dto.getProfileImagePath() != null) {
            user.setProfileImagePath(dto.getProfileImagePath());
        }

        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }

        if (dto.getMotto() != null) {
            user.setMotto(dto.getMotto());
        }

        userRepository.save(user);
    }

    @RabbitListener(queues = "user.registered.stakeholders.queue")
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = new User(
                event.getId(),
                event.getFirstName(),
                event.getLastName(),
                event.getRole()
        );
        userRepository.save(user);
    }
}
