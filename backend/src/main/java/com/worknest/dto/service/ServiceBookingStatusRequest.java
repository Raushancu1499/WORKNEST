package com.worknest.dto.service;

import com.worknest.model.ServiceBookingStatus;
import jakarta.validation.constraints.NotNull;

public record ServiceBookingStatusRequest(@NotNull ServiceBookingStatus status) {
}
