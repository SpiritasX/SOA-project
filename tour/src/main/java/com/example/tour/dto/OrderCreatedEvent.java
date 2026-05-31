package com.example.tour.dto;

import java.util.List;

public class OrderCreatedEvent {
    private Long orderId;
    private List<Long> tourIds;

    public OrderCreatedEvent() {
    }

    public OrderCreatedEvent(Long orderId, List<Long> tourIds) {
        this.orderId = orderId;
        this.tourIds = tourIds;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public List<Long> getTourIds() {
        return tourIds;
    }

    public void setTourIds(List<Long> tourIds) {
        this.tourIds = tourIds;
    }
}
