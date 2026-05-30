package com.example.tour.controller;

import com.example.common.security.UserPrincipal;
import com.example.tour.dto.*;
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
        var tour = tourService.getTour(id);
        return ResponseEntity.ok(tour);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyTours(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var tours = tourService.getToursByAuthorId(user);
        return ResponseEntity.ok(tours);
    }

    @PostMapping
    public ResponseEntity<?> createTour(Authentication authentication, @RequestBody CreateTourDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var tour = tourService.createTour(user, dto);
        return ResponseEntity.ok(tour.getId());
    }

    @GetMapping("/{tourId:\\d+}/locations")
    public ResponseEntity<?> getTourLocations(@PathVariable Long tourId) {
        var locations = tourService.getTourLocationsByTourId(tourId);
        return ResponseEntity.ok(locations);
    }

    @PostMapping("/{tourId:\\d+}/locations")
    public ResponseEntity<?> createTourLocation(Authentication authentication, @PathVariable Long tourId, @RequestBody CreateTourLocationDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var tourLocation = tourService.addTourLocation(user, tourId, dto);
        return ResponseEntity.ok(tourLocation.getId());
    }

    @PutMapping("/{tourId:\\d+}/locations/{locId:\\d+}")
    public ResponseEntity<?> editTourLocation(Authentication authentication, @PathVariable Long tourId, @PathVariable Long locId, @RequestBody EditTourLocationDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var tourLocation = tourService.editTourLocation(user, tourId, dto);
        return ResponseEntity.ok("Edited");
    }

    @DeleteMapping("/{tourId:\\d+}/locations/{locId:\\d+}")
    public ResponseEntity<?> deleteTourLocation(Authentication authentication, @PathVariable Long tourId, @PathVariable Long locId) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.deleteTourLocation(user, tourId, locId);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/{tourId:\\d+}/reviews")
    public ResponseEntity<?> getTourReviews(@PathVariable Long tourId) {
        var reviews = tourService.getTourReviews(tourId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{tourId:\\d+}/reviews")
    public ResponseEntity<?> createTourReview(Authentication authentication, @PathVariable Long tourId, @RequestBody CreateTourReviewDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var tourReview = tourService.createTourReview(user, tourId, dto);
        return ResponseEntity.ok(tourReview.getId());
    }

    @GetMapping("/tourist/location")
    public ResponseEntity<?> getTouristLocation(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        var location = tourService.getTouristLocation(user.getId());
        return ResponseEntity.ok(location);
    }

    @PutMapping("/tourist/location")
    public ResponseEntity<?> updateTouristLocation(Authentication authentication, @RequestBody LocationDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.updateTouristLocation(user, dto);
        return ResponseEntity.ok("Updated");
    }

    @PutMapping("/{tourId:\\d+}/addDuration")
    public ResponseEntity<?> addTourDuration(Authentication authentication, @PathVariable Long tourId, CreateTourDurationDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.addTourDuration(user, tourId, dto);
        return ResponseEntity.ok("Added");
    }

    @DeleteMapping("/{tourId:\\d+}/removeDuration/{durationId:\\d+}")
    public ResponseEntity<?> removeTourDuration(Authentication authentication, @PathVariable Long tourId, @PathVariable Long durationId) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.removeTourDuration(user, tourId, durationId);
        return ResponseEntity.ok("Removed");
    }

    @PutMapping("/{tourId:\\d+}/publish")
    public ResponseEntity<?> publishTour(Authentication authentication, @PathVariable Long tourId) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.publishTour(user, tourId);
        return ResponseEntity.ok("Published");
    }

    @PutMapping("/{toudId:\\d+}/archive")
    public ResponseEntity<?> archiveTour(Authentication authentication, @PathVariable Long tourId) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        tourService.archiveTour(user, tourId);
        return ResponseEntity.ok("Archived");
    }
}
