package com.worknest.dto.jobs;

import com.worknest.model.ConstructionJobStatus;
import jakarta.validation.constraints.NotNull;

public record ConstructionJobStatusRequest(@NotNull ConstructionJobStatus status) {
}
