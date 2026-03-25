package com.worknest.service;

import com.worknest.dto.admin.AdminDashboardResponse;
import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.model.Role;
import com.worknest.repository.ConstructionJobRepository;
import com.worknest.repository.ServiceBookingRepository;
import com.worknest.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceBookingRepository serviceBookingRepository;
    private final ConstructionJobRepository constructionJobRepository;
    private final ServiceBookingService serviceBookingService;
    private final ConstructionJobService constructionJobService;
    private final CurrentUserService currentUserService;
    private final MapperService mapperService;

    public AdminService(
        UserRepository userRepository,
        ServiceBookingRepository serviceBookingRepository,
        ConstructionJobRepository constructionJobRepository,
        ServiceBookingService serviceBookingService,
        ConstructionJobService constructionJobService,
        CurrentUserService currentUserService,
        MapperService mapperService
    ) {
        this.userRepository = userRepository;
        this.serviceBookingRepository = serviceBookingRepository;
        this.constructionJobRepository = constructionJobRepository;
        this.serviceBookingService = serviceBookingService;
        this.constructionJobService = constructionJobService;
        this.currentUserService = currentUserService;
        this.mapperService = mapperService;
    }

    public List<UserSummaryResponse> allUsers() {
        currentUserService.requireRole(Role.ADMIN);
        return userRepository.findAll().stream()
            .map(mapperService::toUserSummary)
            .toList();
    }

    public AdminDashboardResponse dashboard() {
        currentUserService.requireRole(Role.ADMIN);
        return new AdminDashboardResponse(
            userRepository.count(),
            serviceBookingRepository.count(),
            constructionJobRepository.count(),
            serviceBookingService.allBookings().stream().limit(6).toList(),
            constructionJobService.allJobs().stream().limit(6).toList()
        );
    }
}
