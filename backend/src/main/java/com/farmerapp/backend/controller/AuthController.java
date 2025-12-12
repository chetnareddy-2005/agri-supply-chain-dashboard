package com.farmerapp.backend.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmerapp.backend.model.RefreshToken;
import com.farmerapp.backend.model.Role;
import com.farmerapp.backend.model.User;
import com.farmerapp.backend.repository.RefreshTokenRepository;
import com.farmerapp.backend.repository.UserRepository;
import com.farmerapp.backend.security.JwtUtil;
import com.farmerapp.backend.service.AuthService;
import com.farmerapp.backend.service.RefreshTokenService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          RefreshTokenService refreshTokenService,
                          RefreshTokenRepository refreshTokenRepository,
                          JwtUtil jwtUtil) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {

        User user = new User();
        user.setEmail((String) body.get("email"));
        user.setPassword((String) body.get("password"));

        String roleStr = (String) body.get("role");
        Role role = "retailer".equalsIgnoreCase(roleStr)
                ? Role.ROLE_RETAILER
                : Role.ROLE_FARMER;

        return ResponseEntity.ok(authService.register(user, role));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        return ResponseEntity.ok(authService.login(email, password));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        var tokenOpt = refreshTokenRepository.findByToken(refreshToken);

        if (tokenOpt.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid refresh token"));

        RefreshToken token = refreshTokenService.verifyExpiration(tokenOpt.get());
        var userOpt = userRepository.findById(token.getUserId());

        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));

        var user = userOpt.get();
        var roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String access = jwtUtil.generateAccessToken(user.getEmail(), roles);

        return ResponseEntity.ok(Map.of("accessToken", access));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        refreshTokenService.deleteByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
