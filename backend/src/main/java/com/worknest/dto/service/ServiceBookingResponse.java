package com.worknest.dto.service;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.model.ServiceBookingStatus;
import com.worknest.model.ServiceCategory;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ServiceBookingResponse(
    Long id,
    ServiceCategory serviceCategory,
    LocalDate preferredDate,
    String location,
    String description,
    ServiceBookingStatus status,
    UserSummaryResponse customer,
    UserSummaryResponse assignedWorker,
    LocalDateTime createdAt
) {
}
