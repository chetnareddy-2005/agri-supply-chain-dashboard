package com.farmerapp.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmerapp.backend.model.User;
import com.farmerapp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    public AdminController(UserRepository userRepository) { this.userRepository = userRepository; }

    @GetMapping("/pending")
    public ResponseEntity<?> pending() {
        List<User> pending = userRepository.findAll().stream().filter(u -> "pending".equals(u.getStatus())).toList();
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        var opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        User u = opt.get();
        String temp = "Temp@" + UUID.randomUUID().toString().substring(0,6);
        u.setStatus("approved");
        u.setTempPassword(temp);
        u.setPassword(temp); // for demo; admin should send via email in production
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Approved", "tempPassword", temp));
    }

    @DeleteMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Rejected"));
    }
}
