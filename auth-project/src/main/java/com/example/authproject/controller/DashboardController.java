package com.example.authproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5176")
public class DashboardController {

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(Authentication authentication) {

        Map<String, Object> stats = new HashMap<>();

        // Temporary static data (replace with repository counts later)
        stats.put("projects", 5);
        stats.put("sprints", 3);
        stats.put("issues", 12);
        stats.put("hours", 40);

        return stats;
    }
}
