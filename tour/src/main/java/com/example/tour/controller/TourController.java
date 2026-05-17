package com.example.tour.controller;

import com.example.common.security.UserPrincipal;
import com.example.tour.dto.CreateTourDTO;
import com.example.tour.model.User;
import com.example.tour.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/tour")
public class TourController {
    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getTour(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTour(id));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyTours(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return ResponseEntity.ok(tourService.getToursByAuthorId(user));
    }

    @PostMapping
    public ResponseEntity<?> createTour(Authentication authentication, @RequestBody CreateTourDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.createTour(user, dto);
        return ResponseEntity.ok("Tour");
    }
}
