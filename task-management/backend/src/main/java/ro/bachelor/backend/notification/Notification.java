package ro.bachelor.backend.notification;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    @Column(length = 10000)
    private String message;

    private LocalDateTime sentAt;

    public Notification(String username, String message) {
        this.username = username;
        this.message = message;
        this.sentAt = LocalDateTime.now();
    }
}
