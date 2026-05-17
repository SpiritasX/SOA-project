package com.example.tour.service;

import com.example.common.exception.ForbiddenException;
import com.example.common.exception.NotFoundException;
import com.example.common.model.Role;
import com.example.common.security.UserPrincipal;
import com.example.tour.dto.CreateTourDTO;
import com.example.tour.dto.ViewTourDTO;
import com.example.tour.model.Tour;
import com.example.tour.model.User;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TourService {
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public TourService(TourRepository tourRepository, UserRepository userRepository) {
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
    }

    public ViewTourDTO getTour(Long id) {
        return tourRepository.findById(id).map(ViewTourDTO::new).orElseThrow(() -> new NotFoundException("Tour not found"));
    }

    public void createTour(UserPrincipal userPrincipal, CreateTourDTO dto) {
        if (!Role.GUIDE.equals(userPrincipal.getRole())) {
            throw new ForbiddenException("You are not a guide");
        }

        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));

        Tour tour = new Tour(dto.getName(), dto.getDescription(), user);

        tourRepository.save(tour);
    }
}
