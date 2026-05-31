package com.example.purchase.service;

import com.example.common.exception.BadRequestException;
import com.example.common.exception.NotFoundException;
import com.example.purchase.dto.ViewOrderDTO;
import com.example.purchase.model.Order;
import com.example.purchase.model.Tour;
import com.example.purchase.model.TourStatus;
import com.example.purchase.model.User;
import com.example.purchase.repository.OrderRepository;
import com.example.purchase.repository.TourRepository;
import com.example.purchase.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, TourRepository tourRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.tourRepository = tourRepository;
    }

    public List<ViewOrderDTO> getPurchases(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        return orderRepository.findAllByUser(user).stream().map(ViewOrderDTO::new).toList();
    }

    public void createOrder(Long userId, List<Long> tourIds) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

        List<Tour> tours = tourRepository.findAllById(tourIds);

        if (tours.size() != tourIds.size()) {
            throw new NotFoundException("Tour not found");
        }

        if (tours.stream().anyMatch(t -> t.getStatus() == TourStatus.ARCHIVED)) {
            throw new BadRequestException("Archived tours cannot be purchased");
        }

        Order order = new Order(tours, user);
        orderRepository.save(order);
    }
}
