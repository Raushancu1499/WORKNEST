package com.worknest.dto.jobs;

import com.worknest.dto.service.ServiceBookingResponse;
import java.util.List;

public record WorkerJobsResponse(
    List<ServiceBookingResponse> availableServiceBookings,
    List<ServiceBookingResponse> acceptedServiceBookings,
    List<ConstructionJobResponse> availableConstructionJobs,
    List<ConstructionJobResponse> acceptedConstructionJobs
) {
}
