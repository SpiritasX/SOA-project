package com.example.tour.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class TourLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "latitude", nullable = false)),
            @AttributeOverride(name = "longitude", column = @Column(name = "longitude", nullable = false))
    })
    private Location location;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
//    @Column(nullable = false)
    private String imagePath;

    public TourLocation() {}

    public TourLocation(String name, String description, String imagePath, Location location) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.location = location;
    }

    public TourLocation(String name, String description, String imagePath, Double latitude, Double longitude) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.location = new Location(latitude, longitude);
    }

    public Long getId() {
        return id;
    }

    public Location getLocation() {
        return location;
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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof TourLocation that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
