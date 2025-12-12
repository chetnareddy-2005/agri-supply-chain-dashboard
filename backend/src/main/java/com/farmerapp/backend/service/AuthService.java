package com.farmerapp.backend.service;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.farmerapp.backend.model.Role;
import com.farmerapp.backend.model.User;
import com.farmerapp.backend.repository.UserRepository;
import com.farmerapp.backend.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authManager,
                       JwtUtil jwtUtil,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    public Map<String, Object> register(User user, Role role) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Set.of(role));
        user.setStatus("pending");
        user.setRegisteredAt(Instant.now());
        userRepository.save(user);
        return Map.of("message", "Registration submitted. Await admin approval");
    }

    public Map<String, Object> login(String email, String password) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        var user = userOpt.get();
        if (!"approved".equals(user.getStatus())) {
            throw new RuntimeException("User not approved");
        }
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        Set<String> roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), roles);
        var refresh = refreshTokenService.createRefreshToken(user.getId());
        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refresh.getToken(),
                "user", user
        );
    }
}
