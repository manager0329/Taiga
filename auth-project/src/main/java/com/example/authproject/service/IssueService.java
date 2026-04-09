package com.example.authproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.authproject.model.Issue;
import com.example.authproject.model.IssueStatus;
import com.example.authproject.repository.IssueRepository;

@Service
public class IssueService {

    private final IssueRepository repository;

    public IssueService(IssueRepository repository) {
        this.repository = repository;
    }

    public Issue create(Issue issue) {
        issue.setStatus(IssueStatus.OPEN);
        return repository.save(issue);
    }

    public List<Issue> getAll() {
        return repository.findAll();
    }

    public List<Issue> getByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    public Issue update(Long id, Issue updated) {
        Issue issue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setSubject(updated.getSubject());
        issue.setDescription(updated.getDescription());
        issue.setPriority(updated.getPriority());
        issue.setAssignedTo(updated.getAssignedTo());
        issue.setSprint(updated.getSprint());
        issue.setStatus(updated.getStatus());

        return repository.save(issue);
    }

    public Issue updateStatus(Long id, IssueStatus status) {
        Issue issue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus(status);
        return repository.save(issue);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
