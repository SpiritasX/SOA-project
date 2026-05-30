package com.example.tour.repository;

import com.example.tour.model.TourDuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourDurationRepository extends JpaRepository<TourDuration, Long> {
}
