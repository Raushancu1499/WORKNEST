package com.worknest.dto.jobs;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.model.ConstructionJobStatus;
import com.worknest.model.ServiceCategory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ConstructionJobResponse(
    Long id,
    ServiceCategory workType,
    Integer workersRequired,
    Integer workersAssigned,
    LocalDate startDate,
    LocalDate endDate,
    String location,
    BigDecimal dailyWage,
    String description,
    ConstructionJobStatus status,
    UserSummaryResponse contractor,
    List<UserSummaryResponse> assignedWorkers,
    LocalDateTime createdAt
) {
}
