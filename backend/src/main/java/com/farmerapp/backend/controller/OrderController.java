package com.farmerapp.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmerapp.backend.model.OrderEntity;
import com.farmerapp.backend.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository repo;
    public OrderController(OrderRepository repo) { this.repo = repo; }

    @PostMapping
    public OrderEntity place(@RequestBody OrderEntity order) {
        return repo.save(order);
    }

    @GetMapping
    public List<OrderEntity> all() { return repo.findAll(); }

    @GetMapping("/retailer/{id}")
    public List<OrderEntity> byRetailer(@PathVariable Long id) { return repo.findByRetailerId(id); }
}
