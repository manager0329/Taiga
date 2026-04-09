package com.example.authproject.controller;

import com.example.authproject.model.Project;
import com.example.authproject.model.User;
import com.example.authproject.repository.UserRepository;
import com.example.authproject.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService,
                             UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);
        return ResponseEntity.ok(projectService.createProject(project, user));
    }

    // ================= READ =================
    @GetMapping
    public List<Project> getMyProjects(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return projectService.getProjectsByUser(user.getId());
    }

    // ================= UPDATE =================
    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project project,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);
        return ResponseEntity.ok(
                projectService.updateProject(projectId, project, user)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);
        projectService.deleteProject(projectId, user);
        return ResponseEntity.ok("Project deleted successfully");
    }

    // ================= COMMON =================
    private User getLoggedInUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}