package com.example.authproject.service;

import com.example.authproject.model.Project;
import com.example.authproject.model.User;
import com.example.authproject.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // CREATE
    public Project createProject(Project project, User user) {
        project.setUser(user);
        return projectRepository.save(project);
    }

    // READ (MY PROJECTS)
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    // UPDATE
    public Project updateProject(Long projectId, Project updatedProject, User user) {
        Project project = projectRepository
                .findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setProjectName(updatedProject.getProjectName());
        project.setDescription(updatedProject.getDescription());

        return projectRepository.save(project);
    }

    // DELETE
    public void deleteProject(Long projectId, User user) {
        Project project = projectRepository
                .findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}