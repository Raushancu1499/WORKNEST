package com.worknest.dto.common;

import com.worknest.model.Role;

public record UserSummaryResponse(
    Long id,
    String fullName,
    String email,
    String phone,
    String city,
    Role role
) {
}
