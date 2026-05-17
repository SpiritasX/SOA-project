package com.example.tour.service;

import com.example.common.exception.ForbiddenException;
import com.example.common.exception.NotFoundException;
import com.example.common.exception.BadRequestException;
import com.example.common.model.Role;
import com.example.common.security.UserPrincipal;
import com.example.tour.dto.*;
import com.example.tour.model.*;
import com.example.tour.repository.TourLocationRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.TourReviewRepository;
import com.example.tour.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class TourService {
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final TourLocationRepository tourLocationRepository;
    private final TourReviewRepository tourReviewRepository;

    public TourService(TourRepository tourRepository, UserRepository userRepository, TourLocationRepository tourLocationRepository, TourReviewRepository tourReviewRepository) {
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
        this.tourLocationRepository = tourLocationRepository;
        this.tourReviewRepository = tourReviewRepository;
    }

    public ViewTourDTO getTour(Long id) {
        return tourRepository.findById(id).map(ViewTourDTO::new).orElseThrow(() -> new NotFoundException("Tour not found"));
    }

    public Tour createTour(UserPrincipal userPrincipal, CreateTourDTO dto) {
        if (!Role.GUIDE.equals(userPrincipal.getRole())) {
            throw new ForbiddenException("You are not a guide");
        }

        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));

        Tour tour = new Tour(dto.getName(), dto.getDescription(), user);

        return tourRepository.save(tour);
    }

    public List<ViewTourDTO> getToursByAuthorId(UserPrincipal userPrincipal) {
        if (userPrincipal.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        return tourRepository.findAllByAuthorId(userPrincipal.getId()).stream().map(ViewTourDTO::new).toList();
    }

    public TourLocation addTourLocation(UserPrincipal user, Long tourId, CreateTourLocationDTO dto) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));

        TourLocation tl = new TourLocation(
                dto.getName(),
                dto.getDescription(),
                dto.getImagePath(),
                dto.getLatitude(),
                dto.getLongitude()
        );

        tour.addLocation(tl);

        tourRepository.save(tour);

        return tour.getLocations().get(tour.getLocations().size() - 1);
    }

    public TourLocation editTourLocation(UserPrincipal user, Long tourId, EditTourLocationDTO dto) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));

        TourLocation tl = tourLocationRepository.findById(dto.getId()).orElseThrow(() -> new NotFoundException("Tour location not found"));

        if (!tour.getLocations().contains(tl)) {
            throw new BadRequestException("Tour location not part of the tour");
        }

        if (dto.getName() != null) {
            tl.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            tl.setDescription(dto.getDescription());
        }

        if (dto.getImagePath() != null) {
            tl.setImagePath(dto.getImagePath());
        }

        return tourLocationRepository.save(tl);
    }

    public void deleteTourLocation(UserPrincipal user, Long tourId, Long locId) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        TourLocation tl = tourLocationRepository.findById(locId).orElseThrow(() -> new NotFoundException("Tour location not found"));

        if (!tour.getLocations().contains(tl)) {
            throw new BadRequestException("Tour location not part of the tour");
        }

        tour.removeLocation(tl);
        tourRepository.save(tour);
        tourLocationRepository.delete(tl);
    }

    public List<ViewTourLocationDTO> getTourLocationsByTourId(Long tourId) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        return tour.getLocations().stream().map(ViewTourLocationDTO::new).toList();
    }

    public List<ViewTourReviewDTO> getTourReviews(Long tourId) {
        tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));

        return tourReviewRepository.findAllByTourId(tourId).stream().map(ViewTourReviewDTO::new).toList();
    }

    public TourReview createTourReview(UserPrincipal userPrincipal, Long tourId, CreateTourReviewDTO dto) {
        if (!Role.TOURIST.equals(userPrincipal.getRole())) {
            throw new ForbiddenException("You are not a tourist");
        }

        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));

        TourReview tr = new TourReview(
                dto.getRating(),
                dto.getComment(),
                dto.getVisitedAt(),
                tour,
                user
        );
        return tourReviewRepository.save(tr);
    }

    public void updateTouristLocation(UserPrincipal userPrincipal, LocationDTO dto) {
        if (!Role.TOURIST.equals(userPrincipal.getRole())) {
            throw new ForbiddenException("You are not a tourist");
        }

        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));
        user.setCurrentLocation(new Location(dto.getLatitude(), dto.getLongitude()));
        userRepository.save(user);
    }

    public LocationDTO getTouristLocation(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
        return Stream.of(user.getCurrentLocation()).map(LocationDTO::new).findFirst().orElse(null);
    }
}
