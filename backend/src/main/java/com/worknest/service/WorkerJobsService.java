package com.worknest.service;

import com.worknest.dto.jobs.WorkerJobsResponse;
import org.springframework.stereotype.Service;

@Service
public class WorkerJobsService {

    private final ServiceBookingService serviceBookingService;
    private final ConstructionJobService constructionJobService;

    public WorkerJobsService(ServiceBookingService serviceBookingService, ConstructionJobService constructionJobService) {
        this.serviceBookingService = serviceBookingService;
        this.constructionJobService = constructionJobService;
    }

    public WorkerJobsResponse workerJobs() {
        return new WorkerJobsResponse(
            serviceBookingService.availableForWorkers(),
            serviceBookingService.myBookings(),
            constructionJobService.openJobsForWorkers(),
            constructionJobService.myAcceptedJobs()
        );
    }
}
