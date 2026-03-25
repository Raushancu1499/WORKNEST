package com.worknest.service;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.dto.profile.ContractorProfileResponse;
import com.worknest.dto.profile.WorkerProfileRequest;
import com.worknest.dto.profile.WorkerProfileResponse;
import com.worknest.model.Role;
import com.worknest.model.User;
import com.worknest.model.WorkerProfile;
import com.worknest.repository.ContractorProfileRepository;
import com.worknest.repository.WorkerProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final WorkerProfileRepository workerProfileRepository;
    private final ContractorProfileRepository contractorProfileRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapperService;

    public ProfileService(
        WorkerProfileRepository workerProfileRepository,
        ContractorProfileRepository contractorProfileRepository,
        CurrentUserService currentUserService,
        MapperService mapperService
    ) {
        this.workerProfileRepository = workerProfileRepository;
        this.contractorProfileRepository = contractorProfileRepository;
        this.currentUserService = currentUserService;
        this.mapperService = mapperService;
    }

    public UserSummaryResponse currentUserSummary() {
        return mapperService.toUserSummary(currentUserService.getCurrentUser());
    }

    public WorkerProfileResponse getMyWorkerProfile() {
        User user = currentUserService.requireRole(Role.WORKER);
        return workerProfileRepository.findByUserId(user.getId())
            .map(mapperService::toWorkerProfile)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker profile not found"));
    }

    @Transactional
    public WorkerProfileResponse upsertWorkerProfile(WorkerProfileRequest request) {
        User user = currentUserService.requireRole(Role.WORKER);
        WorkerProfile profile = workerProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> new WorkerProfile(user, request.skills(), request.experienceYears(), request.preferredLocation(), request.availability()));

        profile.setSkills(request.skills());
        profile.setExperienceYears(request.experienceYears());
        profile.setPreferredLocation(request.preferredLocation());
        profile.setAvailability(request.availability());
        return mapperService.toWorkerProfile(workerProfileRepository.save(profile));
    }

    public ContractorProfileResponse getMyContractorProfile() {
        User user = currentUserService.requireRole(Role.CONTRACTOR);
        return contractorProfileRepository.findByUserId(user.getId())
            .map(mapperService::toContractorProfile)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contractor profile not found"));
    }
}
