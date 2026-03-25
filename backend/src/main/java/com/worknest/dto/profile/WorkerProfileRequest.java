package com.worknest.dto.profile;

import com.worknest.model.ServiceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record WorkerProfileRequest(
    @NotEmpty Set<ServiceCategory> skills,
    @NotNull Integer experienceYears,
    @NotBlank String preferredLocation,
    @NotBlank String availability
) {
}
