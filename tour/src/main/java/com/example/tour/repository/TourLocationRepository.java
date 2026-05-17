package com.example.tour.repository;

import com.example.tour.model.TourLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourLocationRepository extends JpaRepository<TourLocation, Long> {
}
