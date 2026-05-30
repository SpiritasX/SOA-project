package com.example.tour.model;

import com.example.common.model.Role;
import com.example.tour.service.DistanceCalculator;
import jakarta.persistence.*;

import java.sql.Timestamp;
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
    @Column(nullable = false)
    private Timestamp createdAt;
    private Timestamp publishedAt;
    private Timestamp archivedAt;
    private Double distance;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderColumn(name = "position")
    private final List<TourLocation> locations;
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<TourDuration> durations;

    public Tour() {
        this.price = 0.0;
        this.status = TourStatus.DRAFT;
        this.tags = new HashSet<>();
        this.locations = new ArrayList<>();
        this.difficulty = TourDifficulty.EASY;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.durations = new ArrayList<>();
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public Timestamp getPublishedAt() {
        return publishedAt;
    }

    public void publish() {
        if (this.status != TourStatus.PUBLISHED) {
            this.publishedAt = new Timestamp(System.currentTimeMillis());
            this.status = TourStatus.PUBLISHED;
        }
    }

    public Timestamp getArchivedAt() {
        return archivedAt;
    }

    public void archive() {
        if (this.status != TourStatus.ARCHIVED) {
            this.archivedAt = new Timestamp(System.currentTimeMillis());
            this.status = TourStatus.ARCHIVED;
        }
    }

    public Double getDistance() {
        return distance;
    }

    public User getAuthor() {
        return author;
    }

    public List<TourLocation> getLocations() {
        return locations;
    }

    public void addLocationAndDistance(TourLocation location) {
        this.locations.add(location);
        if (locations.size() > 1) {
            var llastLocation = locations.get(locations.size() - 2);
            var lastLocation = locations.get(locations.size() - 1);
            this.distance += DistanceCalculator.calc(
                    llastLocation.getLocation().getLatitude(), llastLocation.getLocation().getLongitude(),
                    lastLocation.getLocation().getLatitude(), lastLocation.getLocation().getLongitude());
        }
    }

    public void removeLocationAndDistance(TourLocation location) {
        int index = locations.indexOf(location);

        if (index == -1) {
            return;
        }

        TourLocation previous = index > 0
                ? locations.get(index - 1)
                : null;

        TourLocation next = index < locations.size() - 1
                ? locations.get(index + 1)
                : null;

        if (previous != null) {
            distance -= DistanceCalculator.calc(
                    previous.getLocation().getLatitude(),
                    previous.getLocation().getLongitude(),
                    location.getLocation().getLatitude(),
                    location.getLocation().getLongitude()
            );
        }

        if (next != null) {
            distance -= DistanceCalculator.calc(
                    location.getLocation().getLatitude(),
                    location.getLocation().getLongitude(),
                    next.getLocation().getLatitude(),
                    next.getLocation().getLongitude()
            );
        }

        if (previous != null && next != null) {
            distance += DistanceCalculator.calc(
                    previous.getLocation().getLatitude(),
                    previous.getLocation().getLongitude(),
                    next.getLocation().getLatitude(),
                    next.getLocation().getLongitude()
            );
        }

        locations.remove(index);
    }

    public List<TourDuration> getDurations() {
        return durations;
    }

    public void addDuration(TourDuration duration) {
        this.durations.add(duration);
    }

    public void removeDuration(TourDuration duration) {
        this.durations.remove(duration);
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
