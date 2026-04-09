package com.example.authproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.authproject.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {

	List<Issue> findByProjectId(Long projectId);
	
	
}
