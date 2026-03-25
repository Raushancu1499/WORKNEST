package com.worknest.controller;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.dto.profile.ContractorProfileResponse;
import com.worknest.dto.profile.WorkerProfileRequest;
import com.worknest.dto.profile.WorkerProfileResponse;
import com.worknest.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final ProfileService profileService;

    public UserController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public UserSummaryResponse me() {
        return profileService.currentUserSummary();
    }

    @GetMapping("/worker/profile")
    public WorkerProfileResponse getWorkerProfile() {
        return profileService.getMyWorkerProfile();
    }

    @PutMapping("/worker/profile")
    public WorkerProfileResponse updateWorkerProfile(@Valid @RequestBody WorkerProfileRequest request) {
        return profileService.upsertWorkerProfile(request);
    }

    @GetMapping("/contractor/profile")
    public ContractorProfileResponse getContractorProfile() {
        return profileService.getMyContractorProfile();
    }
}
