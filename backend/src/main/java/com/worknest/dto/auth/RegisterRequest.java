package com.worknest.dto.auth;

import com.worknest.model.Role;
import com.worknest.model.ServiceCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record RegisterRequest(
    @NotBlank String fullName,
    @Email @NotBlank String email,
    @NotBlank @Size(min = 6) String password,
    @NotBlank String phone,
    @NotBlank String city,
    @NotNull Role role,
    Set<ServiceCategory> skills,
    Integer experienceYears,
    String preferredLocation,
    String availability,
    String companyName,
    String businessFocus
) {
}
