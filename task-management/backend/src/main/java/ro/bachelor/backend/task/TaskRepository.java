package ro.bachelor.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t " +
            "WHERE (:status IS NULL OR t.status = :status) " +
            "AND (:tag IS NULL OR :tag MEMBER OF t.tags) " +
            "AND t.username = :username")
    List<Task> findAllByStatusAndTag(String username, @Param("status") TaskStatus status, @Param("tag") TaskTag tag);
}
