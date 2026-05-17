package com.example.tour.dto;

import com.example.tour.model.Location;

public class LocationDTO {
    private Double latitude;
    private Double longitude;

    public LocationDTO() {}

    public LocationDTO(Location location) {
        if (location == null) {
            return;
        }
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
    }

    public LocationDTO(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
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
