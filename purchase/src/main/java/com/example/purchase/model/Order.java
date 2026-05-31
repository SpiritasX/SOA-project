package com.example.purchase.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToMany
    @JoinTable(
            name = "order_tour",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "tour_id")
    )
    private List<Tour> tours;
    @Column(nullable = false)
    private Double totalPrice;
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public Order() {
    }

    public Order(List<Tour> tours, User user) {
        this.tours = tours;
        this.totalPrice = tours.stream().mapToDouble(Tour::getPrice).sum();
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public List<Tour> getTours() {
        return tours;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public User getUser() {
        return user;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Order order)) return false;
        return Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
