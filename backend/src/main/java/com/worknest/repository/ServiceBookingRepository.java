package com.worknest.repository;

import com.worknest.model.ServiceBooking;
import com.worknest.model.ServiceBookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {
    List<ServiceBooking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<ServiceBooking> findByAssignedWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<ServiceBooking> findByStatusOrderByCreatedAtDesc(ServiceBookingStatus status);
    List<ServiceBooking> findAllByOrderByCreatedAtDesc();
}
