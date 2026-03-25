package com.worknest.dto.admin;

import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.dto.service.ServiceBookingResponse;
import java.util.List;

public record AdminDashboardResponse(
    long totalUsers,
    long totalBookings,
    long totalConstructionJobs,
    List<ServiceBookingResponse> recentBookings,
    List<ConstructionJobResponse> recentJobs
) {
}
