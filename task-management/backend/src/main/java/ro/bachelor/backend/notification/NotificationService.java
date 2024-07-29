package ro.bachelor.backend.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification send(String username, String message) {
        Notification notification = new Notification(username, message);
        return notificationRepository.save(notification);
    }

}
