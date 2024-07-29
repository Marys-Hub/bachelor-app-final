package ro.bachelor.backend.task.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ro.bachelor.backend.task.TaskTag;

import java.time.LocalDateTime;
import java.util.List;

public record CreateTaskDto(
        @NotBlank
        String title,
        @NotBlank
        String description,
        List<TaskTag> tags,
        @NotNull
        @Future
        LocalDateTime deadline
) {
}
