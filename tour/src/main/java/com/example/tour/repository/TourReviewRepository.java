package com.example.tour.repository;

import com.example.tour.model.TourReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourReviewRepository extends JpaRepository<TourReview, Long> {
    List<TourReview> findAllByTourId(Long id);
}
