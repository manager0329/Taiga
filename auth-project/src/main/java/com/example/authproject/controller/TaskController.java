package com.example.authproject.controller;

import com.example.authproject.model.Sprint;
import com.example.authproject.model.Task;
import com.example.authproject.model.User;
import com.example.authproject.repository.SprintRepository;
import com.example.authproject.repository.TaskRepository;
import com.example.authproject.repository.UserRepository;
import com.example.authproject.service.TaskService;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public TaskController(
            TaskService taskService,
            SprintRepository sprintRepository,
            UserRepository userRepository,
            TaskRepository taskRepository
    ) {
        this.taskService = taskService;
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    // ✅ CREATE TASK
    @PostMapping("/sprint/{sprintId}")
    public Task createTask(
            @PathVariable Long sprintId,
            @RequestBody Task request,
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        return taskService.createTask(request.getTitle(), sprint, user);
    }

    // ✅ LOAD KANBAN
    @GetMapping("/sprint/{sprintId}")
    public List<Task> getTasksBySprint(@PathVariable Long sprintId) {
        return taskService.getTasksBySprint(sprintId);
    }
    
    //GET ALL TASKS
    @GetMapping
    public List<Task> getAllTasks(){
    	return taskService.getAllTasks();
    }

    // ✅ UPDATE TASK (Drag & Drop)
    @PutMapping("/{taskId}")
    public Task updateTask(
            @PathVariable Long taskId,
            @RequestBody Task updatedTask,
            Authentication authentication
    ) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User loggedInUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ STATUS UPDATE (KANBAN) → ANY USER
        if (updatedTask.getStatus() != null) {
            task.setStatus(updatedTask.getStatus());
        }

        // 🔐 TITLE UPDATE → ONLY OWNER
        if (updatedTask.getTitle() != null) {
            if (task.getUser() != null &&
                task.getUser().getId().equals(loggedInUser.getId())) {

                task.setTitle(updatedTask.getTitle());

            } else {
                throw new AccessDeniedException("Only owner can edit task title");
            }
        }

        return taskRepository.save(task);
    }

    // ✅ DELETE TASK
    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}