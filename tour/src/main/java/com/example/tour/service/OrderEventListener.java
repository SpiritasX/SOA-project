package com.example.tour.service;

import com.example.tour.dto.OrderCreatedEvent;
import com.example.tour.dto.OrderValidatedEvent;
import com.example.tour.model.Tour;
import com.example.tour.model.TourStatus;
import com.example.tour.repository.TourRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderEventListener {
    private final TourRepository tourRepository;
    private final RabbitTemplate rabbitTemplate;

    public OrderEventListener(TourRepository tourRepository, RabbitTemplate rabbitTemplate) {
        this.tourRepository = tourRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = "order.created.tour.queue")
    public void handleOrderCreated(OrderCreatedEvent event) {
        List<Tour> tours = tourRepository.findAllById(event.getTourIds());
        
        boolean success = tours.size() == event.getTourIds().size() && 
                          tours.stream().allMatch(t -> t.getStatus() == TourStatus.PUBLISHED);

        rabbitTemplate.convertAndSend("order.exchange", "order.validated", new OrderValidatedEvent(event.getOrderId(), success));
    }
}
