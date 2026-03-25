package com.worknest.dto.profile;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.model.ServiceCategory;
import java.util.Set;

public record WorkerProfileResponse(
    Long id,
    UserSummaryResponse user,
    Set<ServiceCategory> skills,
    Integer experienceYears,
    String preferredLocation,
    String availability
) {
}
