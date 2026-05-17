package com.example.tour.dto;

import com.example.tour.model.TourReview;

import java.sql.Timestamp;
import java.util.List;

public class ViewTourReviewDTO {
    private Long id;
    private Long rating;
    private String comment;
    private Timestamp visitedAt;
    private Timestamp createdAt;
    private List<String> imagePaths;
    private Long authorId;

    public ViewTourReviewDTO() {
    }

    public ViewTourReviewDTO(TourReview tourReview) {
        this.id = tourReview.getId();
        this.rating = tourReview.getRating();
        this.comment = tourReview.getComment();
        this.visitedAt = tourReview.getVisitedAt();
        this.createdAt = tourReview.getCreatedAt();
        this.imagePaths = tourReview.getImagePaths();
        this.authorId = tourReview.getAuthor().getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRating() {
        return rating;
    }

    public void setRating(Long rating) {
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

    public void setVisitedAt(Timestamp visitedAt) {
        this.visitedAt = visitedAt;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
}
