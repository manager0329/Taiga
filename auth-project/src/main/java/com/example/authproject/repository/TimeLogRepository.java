package com.example.authproject.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.authproject.model.TimeLog;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

    List<TimeLog> findByIssueId(Long issueId);

    List<TimeLog> findByUserId(Long userId);
    
    
}