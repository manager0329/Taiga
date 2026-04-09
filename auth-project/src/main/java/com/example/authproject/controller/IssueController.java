package com.example.authproject.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.authproject.model.Issue;
import com.example.authproject.model.IssueStatus;
import com.example.authproject.service.IssueService;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin
public class IssueController {

    private final IssueService service;

    public IssueController(IssueService service) {
        this.service = service;
    }

    @PostMapping
    public Issue create(@RequestBody Issue issue) {
        return service.create(issue);
    }

    @GetMapping
    public List<Issue> getAll() {
        return service.getAll();
    }

    @GetMapping("/project/{projectId}")
    public List<Issue> getByProject(@PathVariable Long projectId) {
        return service.getByProject(projectId);
    }

    @PutMapping("/{id}")
    public Issue update(@PathVariable Long id,
                        @RequestBody Issue issue) {
        return service.update(id, issue);
    }

    @PutMapping("/{id}/status/{status}")
    public Issue updateStatus(@PathVariable Long id,
                              @PathVariable IssueStatus status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Issue deleted successfully");
    }
}
