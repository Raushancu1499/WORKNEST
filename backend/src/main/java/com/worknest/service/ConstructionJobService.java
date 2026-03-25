package com.worknest.service;

import com.worknest.dto.jobs.ConstructionJobRequest;
import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.model.ConstructionJob;
import com.worknest.model.ConstructionJobAssignment;
import com.worknest.model.ConstructionJobStatus;
import com.worknest.model.Role;
import com.worknest.model.User;
import com.worknest.repository.ConstructionJobAssignmentRepository;
import com.worknest.repository.ConstructionJobRepository;
import com.worknest.repository.WorkerProfileRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConstructionJobService {

    private final ConstructionJobRepository constructionJobRepository;
    private final ConstructionJobAssignmentRepository assignmentRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapperService;

    public ConstructionJobService(
        ConstructionJobRepository constructionJobRepository,
        ConstructionJobAssignmentRepository assignmentRepository,
        WorkerProfileRepository workerProfileRepository,
        CurrentUserService currentUserService,
        MapperService mapperService
    ) {
        this.constructionJobRepository = constructionJobRepository;
        this.assignmentRepository = assignmentRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.currentUserService = currentUserService;
        this.mapperService = mapperService;
    }

    @Transactional
    public ConstructionJobResponse create(ConstructionJobRequest request) {
        User contractor = currentUserService.requireRole(Role.CONTRACTOR);
        if (request.endDate().isBefore(request.startDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be on or after start date");
        }

        ConstructionJob job = new ConstructionJob(
            contractor,
            request.workType(),
            request.workersRequired(),
            request.startDate(),
            request.endDate(),
            request.location(),
            request.dailyWage(),
            request.description()
        );
        return map(constructionJobRepository.save(job));
    }

    public List<ConstructionJobResponse> openJobsForWorkers() {
        User worker = currentUserService.requireRole(Role.WORKER);
        var profile = workerProfileRepository.findByUserId(worker.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Create worker profile first"));
        String preferred = normalize(profile.getPreferredLocation());

        return constructionJobRepository.findByStatusInOrderByCreatedAtDesc(
                List.of(ConstructionJobStatus.OPEN, ConstructionJobStatus.PARTIALLY_FILLED)
            ).stream()
            .filter(job -> profile.getSkills().contains(job.getWorkType()))
            .filter(job -> locationMatches(preferred, job.getLocation(), job.getContractor().getCity()))
            .map(this::map)
            .toList();
    }

    @Transactional
    public ConstructionJobResponse accept(Long jobId) {
        User worker = currentUserService.requireRole(Role.WORKER);
        ConstructionJob job = getById(jobId);

        if (job.getStatus() != ConstructionJobStatus.OPEN && job.getStatus() != ConstructionJobStatus.PARTIALLY_FILLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job is not open for acceptance");
        }
        if (assignmentRepository.existsByJobIdAndWorkerId(jobId, worker.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Worker already assigned to this job");
        }
        if (job.getWorkersAssigned() >= job.getWorkersRequired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job already has enough workers");
        }

        assignmentRepository.save(new ConstructionJobAssignment(job, worker));
        job.setWorkersAssigned(job.getWorkersAssigned() + 1);
        job.setStatus(job.getWorkersAssigned() >= job.getWorkersRequired()
            ? ConstructionJobStatus.FILLED
            : ConstructionJobStatus.PARTIALLY_FILLED);

        return map(constructionJobRepository.save(job));
    }

    @Transactional
    public ConstructionJobResponse updateStatus(Long jobId, ConstructionJobStatus targetStatus) {
        User user = currentUserService.getCurrentUser();
        ConstructionJob job = getById(jobId);

        boolean canUpdate = user.getRole() == Role.ADMIN || job.getContractor().getId().equals(user.getId());
        if (!canUpdate) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this construction job");
        }

        ConstructionJobStatus current = job.getStatus();
        if (targetStatus == ConstructionJobStatus.OPEN
            || targetStatus == ConstructionJobStatus.PARTIALLY_FILLED
            || targetStatus == ConstructionJobStatus.FILLED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Open and fill states are managed automatically through worker acceptance"
            );
        }

        boolean validTransition =
            (targetStatus == ConstructionJobStatus.COMPLETED
                && (current == ConstructionJobStatus.FILLED || current == ConstructionJobStatus.PARTIALLY_FILLED)) ||
            (targetStatus == ConstructionJobStatus.CANCELLED && current != ConstructionJobStatus.COMPLETED);

        if (!validTransition && targetStatus != current) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid construction job status transition");
        }

        job.setStatus(targetStatus);
        return map(constructionJobRepository.save(job));
    }

    public List<ConstructionJobResponse> myPostedJobs() {
        User contractor = currentUserService.requireRole(Role.CONTRACTOR);
        return constructionJobRepository.findByContractorIdOrderByCreatedAtDesc(contractor.getId()).stream()
            .map(this::map)
            .toList();
    }

    public List<ConstructionJobResponse> myAcceptedJobs() {
        User worker = currentUserService.requireRole(Role.WORKER);
        return assignmentRepository.findByWorkerIdOrderByAcceptedAtDesc(worker.getId()).stream()
            .map(ConstructionJobAssignment::getJob)
            .distinct()
            .map(this::map)
            .toList();
    }

    public List<ConstructionJobResponse> allJobs() {
        currentUserService.requireRole(Role.ADMIN);
        return constructionJobRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::map)
            .toList();
    }

    private ConstructionJob getById(Long jobId) {
        return constructionJobRepository.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Construction job not found"));
    }

    private ConstructionJobResponse map(ConstructionJob job) {
        return mapperService.toConstructionJob(job, assignmentRepository.findByJobIdOrderByAcceptedAtDesc(job.getId()));
    }

    private boolean locationMatches(String preferredLocation, String jobLocation, String contractorCity) {
        if (preferredLocation.isBlank()) {
            return true;
        }
        String location = normalize(jobLocation);
        String city = normalize(contractorCity);
        return location.contains(preferredLocation) || preferredLocation.contains(location) || city.contains(preferredLocation);
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
    }
}
