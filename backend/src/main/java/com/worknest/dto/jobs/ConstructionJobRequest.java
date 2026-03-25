package com.worknest.dto.jobs;

import com.worknest.model.ServiceCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ConstructionJobRequest(
    @NotNull ServiceCategory workType,
    @NotNull @Min(1) Integer workersRequired,
    @NotNull @FutureOrPresent LocalDate startDate,
    @NotNull @FutureOrPresent LocalDate endDate,
    @NotBlank String location,
    @NotNull @DecimalMin("1.0") BigDecimal dailyWage,
    @NotBlank String description
) {
}
