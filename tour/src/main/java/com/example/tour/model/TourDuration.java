package com.example.tour.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class TourDuration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportType transportType;
    @Column(nullable = false)
    private Integer durationMinutes;
    @ManyToOne(optional = false)
    private Tour tour;

    public TourDuration() {}

    public TourDuration(TransportType transportType, Integer durationMinutes, Tour tour) {
        this.transportType = transportType;
        this.durationMinutes = durationMinutes;
        this.tour = tour;
    }

    public Long getId() {
        return id;
    }

    public TransportType getTransportType() {
        return transportType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Tour getTour() {
        return tour;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof TourDuration that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
