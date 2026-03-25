package com.worknest.dto.service;

import com.worknest.model.ServiceCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ServiceBookingRequest(
    @NotNull ServiceCategory serviceCategory,
    @NotNull @FutureOrPresent LocalDate preferredDate,
    @NotBlank String location,
    @NotBlank String description
) {
}
