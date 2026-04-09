package com.example.authproject.service;

import com.example.authproject.model.Sprint;
import com.example.authproject.model.Task;
import com.example.authproject.model.User;
import com.example.authproject.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // CREATE TASK
    public Task createTask(String title, Sprint sprint, User user) {
        Task task = new Task();
        task.setTitle(title);
        task.setSprint(sprint);
        task.setUser(user);
        task.setStatus("NEW");
        return taskRepository.save(task);
    }

    // LOAD KANBAN
    public List<Task> getTasksBySprint(Long sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }
    
    //GET ALL TASKS
    
    public List<Task> getAllTasks(){
    	return taskRepository.findAll();
    }

    // UPDATE (drag & drop / edit)
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    // DELETE
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
    
    // ASSIGN TASKS TO USERS
    public Task assignTask(Task task, User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }
}