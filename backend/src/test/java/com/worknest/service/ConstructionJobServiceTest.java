package com.worknest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.model.ConstructionJob;
import com.worknest.model.ConstructionJobAssignment;
import com.worknest.model.ConstructionJobStatus;
import com.worknest.model.Role;
import com.worknest.model.ServiceCategory;
import com.worknest.model.User;
import com.worknest.repository.ConstructionJobAssignmentRepository;
import com.worknest.repository.ConstructionJobRepository;
import com.worknest.repository.WorkerProfileRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ConstructionJobServiceTest {

    @Mock
    private ConstructionJobRepository constructionJobRepository;

    @Mock
    private ConstructionJobAssignmentRepository assignmentRepository;

    @Mock
    private WorkerProfileRepository workerProfileRepository;

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private MapperService mapperService;

    private ConstructionJobService constructionJobService;

    @BeforeEach
    void setUp() {
        constructionJobService = new ConstructionJobService(
            constructionJobRepository,
            assignmentRepository,
            workerProfileRepository,
            currentUserService,
            mapperService
        );
    }

    @Test
    void acceptAddsWorkerAndUpdatesStatus() {
        User worker = user(3L, "Worker", Role.WORKER);
        User contractor = user(4L, "Contractor", Role.CONTRACTOR);
        ConstructionJob job = job(11L, contractor, ConstructionJobStatus.OPEN, 2, 0);

        when(currentUserService.requireRole(Role.WORKER)).thenReturn(worker);
        when(constructionJobRepository.findById(11L)).thenReturn(Optional.of(job));
        when(assignmentRepository.existsByJobIdAndWorkerId(11L, 3L)).thenReturn(false);
        when(constructionJobRepository.save(any(ConstructionJob.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(assignmentRepository.findByJobIdOrderByAcceptedAtDesc(11L)).thenReturn(List.of(new ConstructionJobAssignment(job, worker)));
        when(mapperService.toConstructionJob(any(ConstructionJob.class), any())).thenAnswer(invocation -> mapJob(invocation.getArgument(0)));

        ConstructionJobResponse response = constructionJobService.accept(11L);

        assertEquals(1, job.getWorkersAssigned());
        assertEquals(ConstructionJobStatus.PARTIALLY_FILLED, response.status());
        verify(assignmentRepository).save(any(ConstructionJobAssignment.class));
    }

    @Test
    void patchRejectsManualFilledState() {
        User contractor = user(4L, "Contractor", Role.CONTRACTOR);
        ConstructionJob job = job(12L, contractor, ConstructionJobStatus.OPEN, 2, 0);

        when(currentUserService.getCurrentUser()).thenReturn(contractor);
        when(constructionJobRepository.findById(12L)).thenReturn(Optional.of(job));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> constructionJobService.updateStatus(12L, ConstructionJobStatus.FILLED)
        );

        assertEquals(400, exception.getStatusCode().value());
    }

    private User user(Long id, String name, Role role) {
        User user = new User(name, name.toLowerCase() + "@worknest.com", "secret", "9999999999", role, "Bengaluru");
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }

    private ConstructionJob job(Long id, User contractor, ConstructionJobStatus status, int required, int assigned) {
        ConstructionJob job = new ConstructionJob(
            contractor,
            ServiceCategory.PAINTING,
            required,
            LocalDate.now().plusDays(1),
            LocalDate.now().plusDays(5),
            "Bengaluru",
            BigDecimal.valueOf(850),
            "Site paint prep"
        );
        ReflectionTestUtils.setField(job, "id", id);
        ReflectionTestUtils.setField(job, "createdAt", LocalDateTime.now());
        job.setStatus(status);
        job.setWorkersAssigned(assigned);
        return job;
    }

    private ConstructionJobResponse mapJob(ConstructionJob job) {
        return new ConstructionJobResponse(
            job.getId(),
            job.getWorkType(),
            job.getWorkersRequired(),
            job.getWorkersAssigned(),
            job.getStartDate(),
            job.getEndDate(),
            job.getLocation(),
            job.getDailyWage(),
            job.getDescription(),
            job.getStatus(),
            null,
            List.of(),
            job.getCreatedAt()
        );
    }
}
