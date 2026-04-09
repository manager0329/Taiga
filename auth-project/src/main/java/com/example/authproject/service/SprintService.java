package com.example.authproject.service;

import com.example.authproject.model.Sprint;
import com.example.authproject.model.User;
import com.example.authproject.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    // ================= CREATE =================
    public Sprint createSprint(Sprint sprint, User user) {
        sprint.setCreatedBy(user);
        return sprintRepository.save(sprint);
    }

    // ================= READ (MY SPRINTS) =================
    public List<Sprint> getSprintsByUser(Long userId) {
        return sprintRepository.findByCreatedById(userId);
    }

    // ================= UPDATE =================
    public Sprint updateSprint(Long sprintId, Sprint updatedSprint, User user) {

        Sprint sprint = sprintRepository
                .findByIdAndCreatedById(sprintId, user.getId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        sprint.setSprintName(updatedSprint.getSprintName());
        sprint.setStartDate(updatedSprint.getStartDate());
        sprint.setEndDate(updatedSprint.getEndDate());

        return sprintRepository.save(sprint);
    }

    // ================= DELETE =================
    public void deleteSprint(Long sprintId, User user) {

        Sprint sprint = sprintRepository
                .findByIdAndCreatedById(sprintId, user.getId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        sprintRepository.delete(sprint);
    }
}