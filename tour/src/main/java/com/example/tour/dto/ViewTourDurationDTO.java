package com.example.tour.dto;

import com.example.tour.model.TourDuration;

public class ViewTourDurationDTO {
    private Long id;
    private String transportType;
    private Integer durationMinutes;

    public ViewTourDurationDTO() {
    }

    public ViewTourDurationDTO(TourDuration duration) {
        this.id = duration.getId();
        this.transportType = duration.getTransportType().name();
        this.durationMinutes = duration.getDurationMinutes();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransportType() {
        return transportType;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
