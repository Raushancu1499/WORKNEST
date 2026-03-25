package com.worknest.repository;

import com.worknest.model.WorkerProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUserId(Long userId);
}
