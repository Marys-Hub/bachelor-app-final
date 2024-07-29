package ro.bachelor.backend.task.dto;

import jakarta.validation.constraints.NotBlank;
import ro.bachelor.backend.task.TaskTag;

import java.util.List;

public record GenerateDescriptionDto(
        @NotBlank
        String title,
        List<TaskTag> tags
) {
}
