package com.example.tour.dto;

import com.example.tour.model.Tour;

import java.util.List;

public class ViewTourDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> tags;
    private Double price;
    private String difficulty;
    private String status;
    private Long authorId;
    private Long firstTourLocationId;

    public ViewTourDTO() {
    }

    public ViewTourDTO(Tour tour) {
        this.id = tour.getId();
        this.name = tour.getName();
        this.description = tour.getDescription();
        this.tags = tour.getTags().stream().toList();
        this.price = tour.getPrice();
        this.difficulty = tour.getDifficulty().name();
        this.status = tour.getStatus().name();
        this.authorId = tour.getAuthor().getId();
//        this.firstTourLocationId = tour.getLocations().get(0).getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public Long getFirstTourLocationId() {
        return firstTourLocationId;
    }

    public void setFirstTourLocationId(Long firstTourLocationId) {
        this.firstTourLocationId = firstTourLocationId;
    }
}
