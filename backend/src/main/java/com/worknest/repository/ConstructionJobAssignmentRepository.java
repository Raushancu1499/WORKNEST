package com.worknest.repository;

import com.worknest.model.ConstructionJobAssignment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstructionJobAssignmentRepository extends JpaRepository<ConstructionJobAssignment, Long> {
    boolean existsByJobIdAndWorkerId(Long jobId, Long workerId);
    List<ConstructionJobAssignment> findByWorkerIdOrderByAcceptedAtDesc(Long workerId);
    List<ConstructionJobAssignment> findByJobIdOrderByAcceptedAtDesc(Long jobId);
    Optional<ConstructionJobAssignment> findByJobIdAndWorkerId(Long jobId, Long workerId);
}
