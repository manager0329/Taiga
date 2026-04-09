package com.example.authproject.controller;

import com.example.authproject.model.Project;
import com.example.authproject.model.Sprint;
import com.example.authproject.model.User;
import com.example.authproject.repository.ProjectRepository;
import com.example.authproject.repository.SprintRepository;
import com.example.authproject.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public SprintController(
            SprintRepository sprintRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository
    ) {
        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // ================= CREATE SPRINT =================
    @PostMapping("/project/{projectId}")
    public Sprint createSprint(
            @PathVariable Long projectId,
            @RequestBody Sprint sprint
    ) {
        User user = getLoggedInUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        sprint.setCreatedBy(user);
        sprint.setProject(project);

        return sprintRepository.save(sprint);
    }

    // ================= GET MY SPRINTS =================
    @GetMapping("/my")
    public List<Sprint> getMySprints() {
        User user = getLoggedInUser();
        return sprintRepository.findByCreatedById(user.getId());
    }

    // ================= UPDATE SPRINT =================
    @PutMapping("/{sprintId}")
    public Sprint updateSprint(
            @PathVariable Long sprintId,
            @RequestBody Sprint updatedSprint
    ) {
        User user = getLoggedInUser();

        Sprint sprint = sprintRepository
                .findByIdAndCreatedById(sprintId, user.getId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        sprint.setSprintName(updatedSprint.getSprintName());
        sprint.setStartDate(updatedSprint.getStartDate());
        sprint.setEndDate(updatedSprint.getEndDate());

        return sprintRepository.save(sprint);
    }

    // ================= DELETE SPRINT =================
    @DeleteMapping("/{sprintId}")
    public String deleteSprint(@PathVariable Long sprintId) {
        User user = getLoggedInUser();

        Sprint sprint = sprintRepository
                .findByIdAndCreatedById(sprintId, user.getId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        sprintRepository.delete(sprint);
        return "Sprint deleted successfully";
    }

    // ================= COMMON METHOD =================
    private User getLoggedInUser() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
