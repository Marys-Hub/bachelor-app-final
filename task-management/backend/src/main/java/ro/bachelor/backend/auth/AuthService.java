package ro.bachelor.backend.auth;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.bachelor.backend.config.exception.BadRequestException;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private final MailSender mailSender;


    public void resetPassword(String username) {
        String newPassword = RandomStringUtils.randomAlphanumeric(8);
        String encodedPassword = passwordEncoder.encode(newPassword);

        jdbcTemplate.update("update users set password = ? where username = ?", encodedPassword, username);

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom("support@site.ro");
        simpleMailMessage.setTo(username);
        simpleMailMessage.setSubject("Password Reset");
        simpleMailMessage.setText("Your password is: " + newPassword);

        mailSender.send(simpleMailMessage);
    }

    public void createUser(String username, String password) {
        if (userDetailsManager.userExists(username)) {
            throw new BadRequestException("User already exists");
        }

        userDetailsManager.createUser(User.builder().username(username)
                .password(passwordEncoder.encode(password))
                .authorities(Authority.USER.name())
                .build());

    }
}
