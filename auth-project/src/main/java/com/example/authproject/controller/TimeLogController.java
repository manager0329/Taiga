package com.example.authproject.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.authproject.model.Issue;
import com.example.authproject.model.TimeLog;
import com.example.authproject.model.User;
import com.example.authproject.repository.IssueRepository;
import com.example.authproject.repository.UserRepository;
import com.example.authproject.service.TimeLogService;

@RestController
@RequestMapping("/api/timelogs")
@CrossOrigin
public class TimeLogController {

    private final TimeLogService service;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public TimeLogController(
            TimeLogService service,
            IssueRepository issueRepository,
            UserRepository userRepository
    ) {
        this.service = service;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    // ✅ CREATE TIMELOG
    @PostMapping("/issue/{issueId}")
    public TimeLog create(
            @PathVariable Long issueId,
            @RequestBody TimeLog timelog,
            Authentication authentication
    ) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return service.create(timelog, issue, user);
    }

    // ✅ GET ALL TIMELOGS
    @GetMapping
    public List<TimeLog> getAll() {
        return service.getAll();
    }

    // ✅ GET TIMELOGS BY ISSUE
//    @GetMapping
//    public List<TimeLog> getByIssue(@PathVariable Long issueId) {
//        return service.getByIssue(issueId);
//    }
    
	 // ✅ UPDATE (THIS FIXES YOUR PROBLEM)
	    @PutMapping("/{id}")
	    public TimeLog update(
	            @PathVariable Long id,
	            @RequestBody TimeLog timelog
	    ) {
	        return service.update(id, timelog);
	    }

    // ✅ DELETE TIMELOG (ONLY MESSAGE)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Timelog deleted successfully";
    }
}