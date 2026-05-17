package com.example.tour.dto;

public class CreateTourDTO {
    private String name;
    private String description;

    public CreateTourDTO() {
    }

    public CreateTourDTO(String name, String description) {
        this.name = name;
        this.description = description;
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
}
