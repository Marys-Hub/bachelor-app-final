package ro.bachelor.backend.task;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ro.bachelor.backend.ai.GenerativeAiService;
import ro.bachelor.backend.config.exception.BadRequestException;
import ro.bachelor.backend.task.dto.CreateTaskDto;
import ro.bachelor.backend.task.dto.GenerateDescriptionDto;
import ro.bachelor.backend.task.dto.GenericResponseDto;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
@Transactional
public class TaskController {

    private final TaskRepository taskRepository;
    private final GenerativeAiService generativeAiService;

    @GetMapping("/motivational")
    public String generate() {
        return generativeAiService.generateMotivational();
    }

    @PostMapping("/description")
    @SecurityRequirement(name = "basicAuth")
    public String generateDescription(@RequestBody @Valid GenerateDescriptionDto dto) {
        return generativeAiService.generateDescription(dto.title(), dto.tags());
    }

    @GetMapping
    @SecurityRequirement(name = "basicAuth")
    public List<Task> findAll(@RequestParam(required = false) TaskStatus status, @RequestParam(required = false) TaskTag tag, Principal principal) {
        return taskRepository.findAllByStatusAndTag(principal.getName(), status, tag);
    }

    @PostMapping
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> createTask(@RequestBody @Valid CreateTaskDto dto, Principal principal) {
        boolean sameDeadline = taskRepository.exists(Example.of(new Task().setUsername(principal.getName()).setDeadline(dto.deadline())));

        Task task = new Task(principal.getName(), dto.title(), dto.description(), dto.tags(), dto.deadline());
        taskRepository.save(task);

        if (sameDeadline) {
            return ResponseEntity.ok(GenericResponseDto.warning("Task created successfully!", "Check your agenda, you already have another tasks with same deadline"));
        }

        return ResponseEntity.ok(GenericResponseDto.succes("Task created successfully!", generativeAiService.generateShortMotivational()));
    }

    @PutMapping("/{taskId}")
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> updateTask(@PathVariable Long taskId, @RequestBody @Valid CreateTaskDto dto) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.update(dto.title(), dto.description(), dto.tags(), dto.deadline());
        taskRepository.save(task);

        return ResponseEntity.ok(GenericResponseDto.succes("Task updated successfully!", generativeAiService.generateShortMotivational()));
    }


    @PutMapping("/{taskId}/start")
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> startTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.start();
        taskRepository.save(task);

        return ResponseEntity.ok(GenericResponseDto.succes("Task started successfully", generativeAiService.generateShortMotivational()));
    }

    @PutMapping("/{taskId}/cancel")
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> cancelTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.cancel();
        taskRepository.save(task);

        return ResponseEntity.ok(GenericResponseDto.succes("Task cancelled", generativeAiService.generateAbortUserMotivational()));
    }


    @DeleteMapping("/{taskId}")
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> deleteTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        if (task.canDelete()) {
            taskRepository.delete(task);
        } else {
            throw new BadRequestException("Task can't be deleted. Sorry, too late!");
        }

        return ResponseEntity.ok(GenericResponseDto.succes("Task deleted", generativeAiService.generateAbortUserMotivational()));
    }

    @PutMapping("/{taskId}/complete")
    @SecurityRequirement(name = "basicAuth")
    public ResponseEntity<GenericResponseDto> completeTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.complete();
        taskRepository.save(task);

        if (task.status == TaskStatus.DONE_AFTER_DEADLINE) {
            return ResponseEntity.ok(GenericResponseDto.warning("Task completed", generativeAiService.generateDoneAfterDeadlineUserMotivational()));
        }

        return ResponseEntity.ok(GenericResponseDto.succes("Task completed", generativeAiService.generateSuccessUserMotivational()));

    }

}
