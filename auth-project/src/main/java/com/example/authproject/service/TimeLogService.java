package com.example.authproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.authproject.model.Issue;
import com.example.authproject.model.TimeLog;
import com.example.authproject.model.User;
import com.example.authproject.repository.TimeLogRepository;

@Service
public class TimeLogService {

    private final TimeLogRepository repository;

    public TimeLogService(TimeLogRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public TimeLog create(TimeLog timelog, Issue issue, User user) {
        timelog.setIssue(issue);
        timelog.setUser(user);
        return repository.save(timelog);
    }

    // GET ALL
    public List<TimeLog> getAll() {
        return repository.findAll();
    }

    // GET BY ISSUE
    public List<TimeLog> getByIssue(Long issueId) {
        return repository.findByIssueId(issueId);
    }
    
 // ✅ UPDATE
    public TimeLog update(Long id, TimeLog updated) {
        TimeLog existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timelog not found"));

        existing.setTimeSpentHours(updated.getTimeSpentHours());
        existing.setLogDate(updated.getLogDate());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}