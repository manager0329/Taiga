package com.example.authproject.controller;

import com.example.authproject.dto.LoginRequest;
import com.example.authproject.dto.RegisterRequest;
//import com.example.authproject.dto.LoginResponse;
//import com.example.authproject.dto.RegisterResponse;
import com.example.authproject.model.User;
import com.example.authproject.repository.UserRepository;
import com.example.authproject.security.JwtUtil;
import com.example.authproject.service.AuthService;

import org.springframework.dao.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // ✅ CLEAN CONSTRUCTOR
    public AuthController(
            AuthService authService,
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER (PLAIN PASSWORD)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // ✅ plain text

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ LOGIN (PLAIN PASSWORD MATCH)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return response;
    }
    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<String> handleDuplicate(DataIntegrityViolationException ex) {
            if (ex.getMessage().contains("uk_users_email")) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Email already exists");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
        }
    }
}
