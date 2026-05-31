package com.example.tour.controller;

import com.example.common.security.UserPrincipal;
import com.example.tour.dto.TourExecutionDTO;
import com.example.tour.service.TourExecutionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/executions")
public class TourExecutionController {
    private final TourExecutionService tourExecutionService;

    public TourExecutionController(TourExecutionService tourExecutionService) {
        this.tourExecutionService = tourExecutionService;
    }

    @PostMapping("/start/{tourId}")
    public TourExecutionDTO startTour(Authentication authentication, @PathVariable Long tourId) {
        UserPrincipal userPrincipal = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return tourExecutionService.startTour(userPrincipal, tourId);
    }

    @PostMapping("/{id}/abandon")
    public TourExecutionDTO abandonTour(Authentication authentication, @PathVariable Long id) {
        UserPrincipal userPrincipal = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return tourExecutionService.abandonTour(userPrincipal, id);
    }

    @GetMapping("/active")
    public TourExecutionDTO getActiveExecution(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return tourExecutionService.getActiveExecution(userPrincipal);
    }

    @PostMapping("/{id}/check-proximity")
    public TourExecutionDTO checkProximity(Authentication authentication, @PathVariable Long id) {
        UserPrincipal userPrincipal = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return tourExecutionService.checkProximity(userPrincipal, id);
    }
}
