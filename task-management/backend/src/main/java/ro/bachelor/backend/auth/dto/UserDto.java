package ro.bachelor.backend.auth.dto;

import ro.bachelor.backend.auth.Authority;

public record UserDto(
        String username,
        Authority authority
) {
}
