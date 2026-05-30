package com.example.tour.dto;

import java.util.List;

public class CreateTourDTO {
    private String name;
    private String description;
    private String difficulty;
    private List<String> tags;
    private Double price;

    public CreateTourDTO() {
    }

    public CreateTourDTO(String name, String description, String difficulty, List<String> tags, Double price) {
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.tags = tags;
        this.price = price;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
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
}
