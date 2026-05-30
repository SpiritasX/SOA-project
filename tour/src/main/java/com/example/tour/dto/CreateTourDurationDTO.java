package com.example.tour.dto;

public class CreateTourDurationDTO {
    private String transportType;
    private Integer durationMinutes;

    public CreateTourDurationDTO() {
    }

    public String getTransportType() {
        return transportType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
