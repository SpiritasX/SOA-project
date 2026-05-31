package com.example.purchase.dto;

import com.example.purchase.model.Order;
import com.example.purchase.model.Tour;

import java.util.List;

public class ViewOrderDTO {
    private Long id;
    private Double price;
    private List<Long> tourIds;
    private Long userId;
    private String status;

    public ViewOrderDTO() {
    }

    public ViewOrderDTO(Order order) {
        this.id = order.getId();
        this.price = order.getTotalPrice();
        this.tourIds = order.getTours().stream().map(Tour::getId).toList();
        this.userId = order.getUser().getId();
        this.status = order.getStatus().name();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<Long> getTourIds() {
        return tourIds;
    }

    public void setTourIds(List<Long> tourIds) {
        this.tourIds = tourIds;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
