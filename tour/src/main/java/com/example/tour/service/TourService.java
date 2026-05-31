package com.example.tour.service;

import com.example.common.exception.ForbiddenException;
import com.example.common.exception.NotFoundException;
import com.example.common.exception.BadRequestException;
import com.example.common.model.Role;
import com.example.common.security.UserPrincipal;
import com.example.tour.dto.*;
import com.example.tour.model.*;
import com.example.tour.repository.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class TourService {
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final TourLocationRepository tourLocationRepository;
    private final TourReviewRepository tourReviewRepository;
    private final TourDurationRepository tourDurationRepository;
    private final RabbitTemplate rabbitTemplate;

    public TourService(TourRepository tourRepository, UserRepository userRepository, TourLocationRepository tourLocationRepository, TourReviewRepository tourReviewRepository, TourDurationRepository tourDurationRepository, RabbitTemplate rabbitTemplate) {
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
        this.tourLocationRepository = tourLocationRepository;
        this.tourReviewRepository = tourReviewRepository;
        this.tourDurationRepository = tourDurationRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    private Tour checkRoleAndAuthor(UserPrincipal user, Long tourId) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));

        if (!Objects.equals(tour.getAuthor().getId(), user.getId())) {
            throw new ForbiddenException("You are not the author of this tour");
        }

        return tour;
    }

    public ViewTourDTO getTour(Long id, UserPrincipal user) {
        Tour tour = tourRepository.findById(id).orElseThrow(() -> new NotFoundException("Tour not found"));
        if (tour.getStatus() != TourStatus.PUBLISHED) {
            if (user == null || !Objects.equals(tour.getAuthor().getId(), user.getId())) {
                throw new ForbiddenException("Tour not published");
            }
        }
        ViewTourDTO dto = new ViewTourDTO(tour);
        if (user == null || user.getRole() == Role.TOURIST) {
            dto.setStatus(null);
        }
        return dto;
    }

    public Tour createTour(UserPrincipal userPrincipal, CreateTourDTO dto) {
        if (!Role.GUIDE.equals(userPrincipal.getRole())) {
            throw new ForbiddenException("You are not a guide");
        }

        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new NotFoundException("User not found"));

        Tour tour = new Tour(dto.getName(), dto.getDescription(), user);

        if (dto.getDifficulty() != null) {
            tour.setDifficulty(TourDifficulty.valueOf(dto.getDifficulty()));
        }

        if (dto.getTags() != null) {
            dto.getTags().forEach(tour::addTag);
        }

        if (dto.getPrice() != null) {
            tour.setPrice(dto.getPrice());
        }

        tour = tourRepository.save(tour);

        rabbitTemplate.convertAndSend(
                "tour.exchange",
                "tour.created",
                new TourCreatedEvent(tour.getId(), tour.getName(), tour.getPrice())
        );

        return tour;
    }

    public void updateTour(UserPrincipal user, Long id, CreateTourDTO dto) {
        Tour tour = checkRoleAndAuthor(user, id);

        if (dto.getName() != null) {
            tour.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            tour.setDescription(dto.getDescription());
        }

        if (dto.getDifficulty() != null) {
            tour.setDifficulty(TourDifficulty.valueOf(dto.getDifficulty()));
        }

        if (dto.getTags() != null) {
            tour.getTags().clear();
            dto.getTags().forEach(tour::addTag);
        }

        if (dto.getPrice() != null) {
            tour.setPrice(dto.getPrice());
        }

        tourRepository.save(tour);

        rabbitTemplate.convertAndSend(
                "tour.exchange",
                "tour.updated",
                new TourUpdatedEvent(tour.getId(), tour.getName(), tour.getPrice())
        );
    }

    public List<ViewTourDTO> getTours(UserPrincipal user) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        return tourRepository.findAllByAuthorId(user.getId()).stream().map(ViewTourDTO::new).toList();
    }

    public List<ViewTourDTO> getTours(UserPrincipal user, TourStatus status) {
        if (user.getRole() != Role.GUIDE) {
            throw new ForbiddenException("You are not a guide");
        }

        List<Tour> tours = tourRepository.findAllByAuthorIdAndStatus(user.getId(), status);

        return tours.stream().map(ViewTourDTO::new).toList();
    }

    public List<ViewTourDTO> getAllPublishedTours(UserPrincipal user) {
        return tourRepository.findAllByStatus(TourStatus.PUBLISHED).stream().map(tour -> {
            ViewTourDTO dto = new ViewTourDTO(tour);
            if (user == null || user.getRole() == Role.TOURIST) {
                dto.setStatus(null);
            }
            return dto;
        }).toList();
    }

    public TourLocation addTourLocation(UserPrincipal user, Long tourId, CreateTourLocationDTO dto) {
        Tour tour = checkRoleAndAuthor(user, tourId);

        TourLocation tl = new TourLocation(
                dto.getName(),
                dto.getDescription(),
                dto.getImagePath(),
                dto.getLatitude(),
                dto.getLongitude()
        );

        tour.addLocationAndDistance(tl);

        tourRepository.save(tour);

        return tour.getLocations().get(tour.getLocations().size() - 1);
    }

    public TourLocation editTourLocation(UserPrincipal user, Long tourId, EditTourLocationDTO dto) {
        Tour tour = checkRoleAndAuthor(user, tourId);

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

        tour.removeLocationAndDistance(tl);
        tourRepository.save(tour);
        tourLocationRepository.delete(tl);
    }

    public List<ViewTourLocationDTO> getTourLocationsByTourId(Long tourId, UserPrincipal user, boolean isPurchased) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        var locations = tour.getLocations();
        if ((user == null || user.getRole() == Role.TOURIST) && !isPurchased) {
            if (locations.isEmpty()) return List.of();
            return List.of(new ViewTourLocationDTO(locations.get(0)));
        }
        return locations.stream().map(ViewTourLocationDTO::new).toList();
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

    public void publishTour(UserPrincipal user, Long tourId) {
        Tour tour = checkRoleAndAuthor(user, tourId);

        if (tour.getStatus() == TourStatus.PUBLISHED) {
            throw new BadRequestException("Tour already published");
        }

        if (tour.getName().isEmpty() || tour.getDescription().isEmpty() || tour.getTags().isEmpty() || tour.getPrice() == 0 || tour.getLocations().size() < 2 || tour.getDurations().isEmpty()) {
            throw new BadRequestException("Tour is incomplete");
        }

        tour.publish();
        tourRepository.save(tour);

        rabbitTemplate.convertAndSend(
                "tour.exchange",
                "tour.published",
                tour.getId()
        );
    }

    public void addTourDuration(UserPrincipal user, Long tourId, CreateTourDurationDTO dto) {
        Tour tour = checkRoleAndAuthor(user, tourId);

        TourDuration td = new TourDuration(
                TransportType.valueOf(dto.getTransportType()),
                dto.getDurationMinutes(),
                tour
        );
        tour.addDuration(td);
        tourRepository.save(tour);
    }

    public void removeTourDuration(UserPrincipal user, Long tourId, Long durationId) {
        Tour tour = checkRoleAndAuthor(user, tourId);

        TourDuration td = tourDurationRepository.findById(durationId).orElseThrow(() -> new NotFoundException("Tour duration not found"));

        tour.removeDuration(td);
        tourRepository.save(tour);
        tourDurationRepository.delete(td);
    }

    public void archiveTour(UserPrincipal user, Long tourId) {
        Tour tour = checkRoleAndAuthor(user, tourId);

        if (tour.getStatus() == TourStatus.ARCHIVED) {
            throw new BadRequestException("Tour already archived");
        }

        tour.archive();
        tourRepository.save(tour);

        rabbitTemplate.convertAndSend(
                "tour.exchange",
                "tour.archived",
                tour.getId()
        );
    }
}
