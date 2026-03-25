package com.worknest.controller;

import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.service.ConstructionJobService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contractor")
public class ContractorController {

    private final ConstructionJobService constructionJobService;

    public ContractorController(ConstructionJobService constructionJobService) {
        this.constructionJobService = constructionJobService;
    }

    @GetMapping("/jobs/my")
    public List<ConstructionJobResponse> myPostedJobs() {
        return constructionJobService.myPostedJobs();
    }
}
