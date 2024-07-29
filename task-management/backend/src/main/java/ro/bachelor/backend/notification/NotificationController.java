package ro.bachelor.backend.notification;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    @SecurityRequirement(name = "basicAuth")
    public List<Notification> getNotifications(Principal principal) {
        return notificationRepository.findAll(Example.of(new Notification().setUsername(principal.getName()))
                , Sort.by(Sort.Direction.DESC, "sentAt"));
    }
}
