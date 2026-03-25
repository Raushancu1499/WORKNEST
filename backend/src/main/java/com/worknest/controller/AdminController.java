package com.worknest.controller;

import com.worknest.dto.admin.AdminDashboardResponse;
import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.dto.service.ServiceBookingResponse;
import com.worknest.service.AdminService;
import com.worknest.service.ConstructionJobService;
import com.worknest.service.ServiceBookingService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ServiceBookingService serviceBookingService;
    private final ConstructionJobService constructionJobService;

    public AdminController(
        AdminService adminService,
        ServiceBookingService serviceBookingService,
        ConstructionJobService constructionJobService
    ) {
        this.adminService = adminService;
        this.serviceBookingService = serviceBookingService;
        this.constructionJobService = constructionJobService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<UserSummaryResponse> users() {
        return adminService.allUsers();
    }

    @GetMapping("/bookings")
    public List<ServiceBookingResponse> bookings() {
        return serviceBookingService.allBookings();
    }

    @GetMapping("/jobs")
    public List<ConstructionJobResponse> jobs() {
        return constructionJobService.allJobs();
    }
}
