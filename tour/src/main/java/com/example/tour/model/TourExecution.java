package com.example.tour.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Entity
public class TourExecution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private Tour tour;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TourExecutionStatus status;

    @Column(nullable = false)
    private Timestamp startTime;

    private Timestamp endTime;

    @Column(nullable = false)
    private Timestamp lastActivity;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "start_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "start_longitude"))
    })
    private Location startLocation;

    @ElementCollection
    @CollectionTable(name = "tour_execution_completed_locations", joinColumns = @JoinColumn(name = "tour_execution_id"))
    @MapKeyColumn(name = "location_id")
    @Column(name = "reached_at")
    private Map<Long, Timestamp> completedLocations = new HashMap<>();

    public TourExecution() {}

    public TourExecution(User user, Tour tour) {
        this.user = user;
        this.tour = tour;
        this.startTime = new Timestamp(System.currentTimeMillis());
        this.lastActivity = new Timestamp(System.currentTimeMillis());
        this.status = TourExecutionStatus.ACTIVE;
        this.startLocation = user.getCurrentLocation();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Tour getTour() {
        return tour;
    }

    public TourExecutionStatus getStatus() {
        return status;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public Timestamp getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(Timestamp lastActivity) {
        this.lastActivity = lastActivity;
    }

    public Location getStartLocation() {
        return startLocation;
    }

    public Map<Long, Timestamp> getCompletedLocations() {
        return completedLocations;
    }

    public void completeLocation(Long locationId, Timestamp reachedAt) {
        this.completedLocations.put(locationId, reachedAt);
        this.lastActivity = reachedAt;
    }

    public void complete(Timestamp endTime) {
        this.status = TourExecutionStatus.COMPLETED;
        this.endTime = endTime;
        this.lastActivity = endTime;
    }

    public void abandon() {
        this.status = TourExecutionStatus.ABANDONED;
        this.endTime = new Timestamp(System.currentTimeMillis());
        this.lastActivity = new Timestamp(System.currentTimeMillis());
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof TourExecution that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
