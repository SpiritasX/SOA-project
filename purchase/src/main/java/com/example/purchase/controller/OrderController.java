package com.example.purchase.controller;

import com.example.common.security.UserPrincipal;
import com.example.purchase.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyPurchases(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getPurchases(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(Authentication authentication, @RequestBody List<Long> tourIds) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        orderService.createOrder(user.getId(), tourIds);
        return ResponseEntity.ok("Order created");
    }
}
