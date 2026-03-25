package com.worknest.repository;

import com.worknest.model.ConstructionJob;
import com.worknest.model.ConstructionJobStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstructionJobRepository extends JpaRepository<ConstructionJob, Long> {
    List<ConstructionJob> findByContractorIdOrderByCreatedAtDesc(Long contractorId);
    List<ConstructionJob> findByStatusInOrderByCreatedAtDesc(List<ConstructionJobStatus> statuses);
    List<ConstructionJob> findAllByOrderByCreatedAtDesc();
}
