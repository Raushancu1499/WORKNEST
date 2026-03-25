package com.worknest.repository;

import com.worknest.model.ContractorProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractorProfileRepository extends JpaRepository<ContractorProfile, Long> {
    Optional<ContractorProfile> findByUserId(Long userId);
}
