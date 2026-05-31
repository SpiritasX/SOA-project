package com.example.tour.dto;

import com.example.tour.model.TourExecution;
import com.example.tour.model.TourExecutionStatus;

import java.sql.Timestamp;
import java.util.Map;

public class TourExecutionDTO {
    private Long id;
    private Long userId;
    private Long tourId;
    private TourExecutionStatus status;
    private Timestamp startTime;
    private Timestamp endTime;
    private Timestamp lastActivity;
    private LocationDTO startLocation;
    private Map<Long, Timestamp> completedLocations;

    public TourExecutionDTO() {}

    public TourExecutionDTO(TourExecution execution) {
        this.id = execution.getId();
        this.userId = execution.getUser().getId();
        this.tourId = execution.getTour().getId();
        this.status = execution.getStatus();
        this.startTime = execution.getStartTime();
        this.endTime = execution.getEndTime();
        this.lastActivity = execution.getLastActivity();
        this.startLocation = new LocationDTO(execution.getStartLocation());
        this.completedLocations = execution.getCompletedLocations();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public TourExecutionStatus getStatus() {
        return status;
    }

    public void setStatus(TourExecutionStatus status) {
        this.status = status;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public Timestamp getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(Timestamp lastActivity) {
        this.lastActivity = lastActivity;
    }

    public LocationDTO getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(LocationDTO startLocation) {
        this.startLocation = startLocation;
    }

    public Map<Long, Timestamp> getCompletedLocations() {
        return completedLocations;
    }

    public void setCompletedLocations(Map<Long, Timestamp> completedLocations) {
        this.completedLocations = completedLocations;
    }
}
