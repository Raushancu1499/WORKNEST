package com.worknest.controller;

import com.worknest.dto.jobs.ConstructionJobRequest;
import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.dto.jobs.ConstructionJobStatusRequest;
import com.worknest.service.ConstructionJobService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/construction-jobs")
public class ConstructionJobController {

    private final ConstructionJobService constructionJobService;

    public ConstructionJobController(ConstructionJobService constructionJobService) {
        this.constructionJobService = constructionJobService;
    }

    @PostMapping
    public ConstructionJobResponse create(@Valid @RequestBody ConstructionJobRequest request) {
        return constructionJobService.create(request);
    }

    @GetMapping("/open")
    public List<ConstructionJobResponse> openJobs() {
        return constructionJobService.openJobsForWorkers();
    }

    @GetMapping("/my")
    public List<ConstructionJobResponse> myAcceptedJobs() {
        return constructionJobService.myAcceptedJobs();
    }

    @PostMapping("/{id}/accept")
    public ConstructionJobResponse accept(@PathVariable Long id) {
        return constructionJobService.accept(id);
    }

    @PatchMapping("/{id}/status")
    public ConstructionJobResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ConstructionJobStatusRequest request) {
        return constructionJobService.updateStatus(id, request.status());
    }
}
