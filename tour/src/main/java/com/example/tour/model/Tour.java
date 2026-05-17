package com.example.tour.model;

import com.example.common.model.Role;
import jakarta.persistence.*;

import java.util.*;

@Entity(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
    private final Set<String> tags;
    @Column(nullable = false, check = @CheckConstraint(constraint = "price >= 0"))
    private Double price;
    @Enumerated(EnumType.STRING)
    private TourDifficulty difficulty;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TourStatus status;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderColumn(name = "position")
    private final List<TourLocation> locations;

    public Tour() {
        this.price = 0.0;
        this.status = TourStatus.DRAFT;
        this.tags = new HashSet<>();
        this.locations = new ArrayList<>();
        this.difficulty = TourDifficulty.EASY;
    }

    public Tour(String name, String description, User author) {
        this();
        this.name = name;
        this.description = description;
        if (author.getRole() != Role.GUIDE) {
            throw new IllegalArgumentException("Only guides can create tours");
        }
        this.author = author;
    }

    private static void validatePrice(Double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }

    public Long getId() {
        return id;
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

    public Set<String> getTags() {
        return tags;
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public void removeTag(String tag) {
        this.tags.remove(tag);
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        validatePrice(price);
        this.price = price;
    }

    public TourDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(TourDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public TourStatus getStatus() {
        return status;
    }

    public void setStatus(TourStatus status) {
        this.status = status;
    }

    public User getAuthor() {
        return author;
    }

    public List<TourLocation> getLocations() {
        return locations;
    }

    public void addLocation(TourLocation location) {
        this.locations.add(location);
    }

    public void removeLocation(TourLocation location) {
        this.locations.remove(location);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Tour tour)) return false;
        return Objects.equals(id, tour.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
