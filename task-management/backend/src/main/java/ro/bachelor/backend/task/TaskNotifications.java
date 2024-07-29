package ro.bachelor.backend.task;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.bachelor.backend.ai.GenerativeAiService;
import ro.bachelor.backend.notification.NotificationService;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskNotifications {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final GenerativeAiService generativeAiService;


    // task creat
    //
    // run job 30s => transmit notificare
    //
    // run job 30s => transmit notificare
    //
    // run job 30s => transmit notificare
    //
    // task done
    //
    // run job 30s => nu ii mai transmit notificare

    //    @Scheduled(cron = "0 0 7,10,13,16,19,22 * * ?") // at specific hours
//    @Scheduled(cron = "0/30 * * ? * *") // each 30seconds
    public void remindTomorrowAppointments() {
        taskRepository.findAll(Example.of(new Task().setStatus(TaskStatus.IN_PROGRESS)))
                .forEach(task -> {
                    String message = generativeAiService.generateNotificationReminderUserMotivational(task.username, task.title, task.deadline);
                    notificationService.send(task.username, message);
                });
    }
}
