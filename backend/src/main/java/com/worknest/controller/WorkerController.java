package com.worknest.controller;

import com.worknest.dto.jobs.WorkerJobsResponse;
import com.worknest.service.WorkerJobsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    private final WorkerJobsService workerJobsService;

    public WorkerController(WorkerJobsService workerJobsService) {
        this.workerJobsService = workerJobsService;
    }

    @GetMapping("/jobs")
    public WorkerJobsResponse jobs() {
        return workerJobsService.workerJobs();
    }
}
