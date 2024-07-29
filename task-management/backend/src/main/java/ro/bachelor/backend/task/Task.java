package ro.bachelor.backend.task;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String username;
    public String title;
    public String description;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    public List<TaskTag> tags;

    @Enumerated(EnumType.STRING)
    public TaskStatus status;

    public LocalDateTime deadline;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public Task(String username, String title, String description, List<TaskTag> tags, LocalDateTime deadline) {
        this.username = username;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.deadline = deadline;
        this.status = TaskStatus.TO_DO;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String description, List<TaskTag> tags, LocalDateTime deadline) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.deadline = deadline;
        this.updatedAt = LocalDateTime.now();
    }

    public void start() {
        this.status = TaskStatus.IN_PROGRESS;
        this.updatedAt = LocalDateTime.now();
    }

    public void complete() {
        if (deadline.isBefore(LocalDateTime.now())) {
            this.status = TaskStatus.DONE_AFTER_DEADLINE;
        } else {
            this.status = TaskStatus.DONE;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = TaskStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean canDelete() {
        return status == TaskStatus.TO_DO;
    }
}
