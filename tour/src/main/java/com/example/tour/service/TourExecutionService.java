package com.example.tour.service;

import com.example.common.exception.BadRequestException;
import com.example.common.exception.ForbiddenException;
import com.example.common.exception.NotFoundException;
import com.example.common.security.UserPrincipal;
import com.example.tour.dto.TourExecutionDTO;
import com.example.tour.model.*;
import com.example.tour.repository.TourExecutionRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Service
public class TourExecutionService {
    private final TourExecutionRepository tourExecutionRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public TourExecutionService(TourExecutionRepository tourExecutionRepository, TourRepository tourRepository, UserRepository userRepository) {
        this.tourExecutionRepository = tourExecutionRepository;
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
    }

    public TourExecutionDTO startTour(UserPrincipal userPrincipal, Long tourId) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));

        if (tour.getStatus() == TourStatus.DRAFT) {
            throw new BadRequestException("Cannot start a draft tour");
        }

        Optional<TourExecution> activeExecution = tourExecutionRepository.findByUserAndStatus(user, TourExecutionStatus.ACTIVE);
        if (activeExecution.isPresent()) {
            throw new BadRequestException("User already has an active tour execution");
        }

        TourExecution execution = new TourExecution(user, tour);

        return new TourExecutionDTO(tourExecutionRepository.save(execution));
    }

    public TourExecutionDTO abandonTour(UserPrincipal userPrincipal, Long executionId) {
        TourExecution execution = tourExecutionRepository.findById(executionId).orElseThrow(() -> new NotFoundException("Tour execution not found"));

        if (!execution.getUser().getId().equals(userPrincipal.getId())) {
            throw new ForbiddenException("You cannot abandon someone else's tour execution");
        }

        if (execution.getStatus() != TourExecutionStatus.ACTIVE) {
            throw new BadRequestException("Tour execution is not active");
        }

        execution.abandon();
        return new TourExecutionDTO(tourExecutionRepository.save(execution));
    }

    public TourExecutionDTO getActiveExecution(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));
        return tourExecutionRepository.findByUserAndStatus(user, TourExecutionStatus.ACTIVE)
                .map(TourExecutionDTO::new)
                .orElseThrow(() -> new NotFoundException("No active tour execution found"));
    }

    public TourExecutionDTO checkProximity(UserPrincipal userPrincipal, Long executionId) {
        TourExecution execution = tourExecutionRepository.findById(executionId).orElseThrow(() -> new NotFoundException("Tour execution not found"));

        if (!execution.getUser().getId().equals(userPrincipal.getId())) {
            throw new ForbiddenException("Not your execution");
        }

        if (execution.getStatus() != TourExecutionStatus.ACTIVE) {
            throw new BadRequestException("Tour execution is not active");
        }

        User user = execution.getUser();
        Location userLoc = user.getCurrentLocation();
        
        if (userLoc == null) {
            execution.setLastActivity(new Timestamp(System.currentTimeMillis()));
            return new TourExecutionDTO(tourExecutionRepository.save(execution));
        }

        Tour tour = execution.getTour();
        Timestamp now = new Timestamp(System.currentTimeMillis());

        for (TourLocation tourLoc : tour.getLocations()) {
            if (execution.getCompletedLocations().containsKey(tourLoc.getId())) {
                continue;
            }

            double distance = DistanceCalculator.calc(
                    userLoc.getLatitude(), userLoc.getLongitude(),
                    tourLoc.getLocation().getLatitude(), tourLoc.getLocation().getLongitude());

            if (distance <= 0.2) {
                execution.completeLocation(tourLoc.getId(), now);
            }
        }

        if (execution.getCompletedLocations().size() == tour.getLocations().size()) {
            execution.complete(now);
        }

        execution.setLastActivity(now);
        return new TourExecutionDTO(tourExecutionRepository.save(execution));
    }
}
