package com.stakeholders.service;

import com.stakeholders.dto.DetailViewDTO;
import com.stakeholders.dto.ListViewDTO;
import com.stakeholders.dto.UpdateDTO;
import com.stakeholders.exception.NotFoundException;
import com.stakeholders.model.User;
import com.stakeholders.repository.UserRepository;
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
}
