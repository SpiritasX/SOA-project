package com.example.purchase.service;

import com.example.common.exception.NotFoundException;
import com.example.purchase.dto.TourCreatedEvent;
import com.example.purchase.dto.TourUpdatedEvent;
import com.example.purchase.model.Tour;
import com.example.purchase.model.TourStatus;
import com.example.purchase.repository.TourRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class TourService {
    private final TourRepository tourRepository;

    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    @RabbitListener(queues = "tour.created.purchase.queue")
    public void handleTourCreatedEvent(TourCreatedEvent event) {
        Tour tour = new Tour(
                event.getId(),
                event.getName(),
                event.getPrice()
        );
        tourRepository.save(tour);
    }

    @RabbitListener(queues = "tour.updated.purchase.queue")
    public void handleTourUpdatedEvent(TourUpdatedEvent event) {
        Tour tour = tourRepository.findById(event.getId()).orElseThrow(() -> new NotFoundException("Tour not found"));

        if (event.getName() != null) {
            tour.setName(event.getName());
        }

        if (event.getPrice() != null) {
            tour.setPrice(event.getPrice());
        }

        tourRepository.save(tour);
    }

    @RabbitListener(queues = "tour.published.purchase.queue")
    public void handleTourPublishedEvent(Long tourId) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        tour.setStatus(TourStatus.PUBLISHED);
        tourRepository.save(tour);
    }

    @RabbitListener(queues = "tour.archived.purchase.queue")
    public void handleTourArchivedEvent(Long tourId) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new NotFoundException("Tour not found"));
        tour.setStatus(TourStatus.ARCHIVED);
        tourRepository.save(tour);
    }
}
