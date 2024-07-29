package ro.bachelor.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDto(
        @Email
        @NotBlank
        String username,
        @NotBlank
        String password
) {
}
