package com.example.tour.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Entity(name = "tour_reviews")
public class TourReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, check = @CheckConstraint(constraint = "rating IN (1, 2, 3, 4, 5)"))
    private Long rating;
    private String comment;
    @Column(nullable = false)
    private Timestamp visitedAt;
    @Column(nullable = false)
    private Timestamp createdAt;
    private List<String> imagePaths;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Tour tour;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;

    public TourReview() {
    }

    public TourReview(Long rating, Timestamp visitedAt, Tour tour, User user) {
        validateRating(rating);
        this.rating = rating;
        this.visitedAt = visitedAt;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.imagePaths = new ArrayList<>();
        this.tour = tour;
        this.author = user;
    }

    public TourReview(Long rating, String comment, Timestamp visitedAt, Tour tour, User user) {
        validateRating(rating);
        this.rating = rating;
        this.comment = comment;
        this.visitedAt = visitedAt;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.imagePaths = new ArrayList<>();
        this.tour = tour;
        this.author = user;
    }

    private static void validateRating(Long rating) {
        if (Stream.of(1L, 2L, 3L, 4L, 5L).noneMatch(r -> r.equals(rating))) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }

    public Long getId() {
        return id;
    }

    public Long getRating() {
        return rating;
    }

    public void setRating(Long rating) {
        validateRating(rating);
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Timestamp getVisitedAt() {
        return visitedAt;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void addImagePath(String imagePath) {
        this.imagePaths.add(imagePath);
    }

    public void removeImagePath(String imagePath) {
        this.imagePaths.remove(imagePath);
    }

    public Tour getTour() {
        return tour;
    }

    public User getAuthor() {
        return author;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof TourReview that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
