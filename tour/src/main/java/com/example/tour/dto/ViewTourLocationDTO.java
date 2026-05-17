package com.example.tour.dto;

import com.example.tour.model.TourLocation;

public class ViewTourLocationDTO {
    private Long id;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;

    public ViewTourLocationDTO() {
    }

    public ViewTourLocationDTO(TourLocation tourLocation) {
        this.id = tourLocation.getId();
        this.name = tourLocation.getName();
        this.description = tourLocation.getDescription();
        this.latitude = tourLocation.getLocation().getLatitude();
        this.longitude = tourLocation.getLocation().getLongitude();
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
