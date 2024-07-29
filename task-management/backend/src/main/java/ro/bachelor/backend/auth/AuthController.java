package ro.bachelor.backend.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import ro.bachelor.backend.auth.dto.CreateUserDto;
import ro.bachelor.backend.auth.dto.UserDto;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody @Valid CreateUserDto dto) {
        authService.createUser(dto.username(), dto.password());

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam @Email String username) {
        authService.resetPassword(username);

        return ResponseEntity.ok("You will receive an email with your new password");
    }

    @GetMapping("/current-user")
    public UserDto getCurrentUser(Principal principal) {
        return jdbcTemplate.queryForObject(
                "select u.username, a.authority from users u join authorities a on u.username = a.username where u.username = ?",
                (rs, rowNum) -> new UserDto(rs.getString("username"), Authority.valueOf(rs.getString("authority"))),
                principal.getName()
        );
    }

}
