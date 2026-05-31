package com.example.tour.repository;

import com.example.tour.model.TourExecution;
import com.example.tour.model.TourExecutionStatus;
import com.example.tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TourExecutionRepository extends JpaRepository<TourExecution, Long> {
    Optional<TourExecution> findByUserAndStatus(User user, TourExecutionStatus status);
}
