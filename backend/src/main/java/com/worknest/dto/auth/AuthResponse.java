package com.worknest.dto.auth;

import com.worknest.model.Role;

public record AuthResponse(
    String token,
    Long id,
    String fullName,
    String email,
    Role role,
    String city
) {
}
