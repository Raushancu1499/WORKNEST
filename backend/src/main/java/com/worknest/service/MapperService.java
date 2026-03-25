package com.worknest.service;

import com.worknest.dto.common.UserSummaryResponse;
import com.worknest.dto.jobs.ConstructionJobResponse;
import com.worknest.dto.profile.ContractorProfileResponse;
import com.worknest.dto.profile.WorkerProfileResponse;
import com.worknest.dto.service.ServiceBookingResponse;
import com.worknest.model.ConstructionJob;
import com.worknest.model.ConstructionJobAssignment;
import com.worknest.model.ContractorProfile;
import com.worknest.model.ServiceBooking;
import com.worknest.model.User;
import com.worknest.model.WorkerProfile;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MapperService {

    public UserSummaryResponse toUserSummary(User user) {
        if (user == null) {
            return null;
        }
        return new UserSummaryResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getCity(),
            user.getRole()
        );
    }

    public WorkerProfileResponse toWorkerProfile(WorkerProfile profile) {
        return new WorkerProfileResponse(
            profile.getId(),
            toUserSummary(profile.getUser()),
            profile.getSkills(),
            profile.getExperienceYears(),
            profile.getPreferredLocation(),
            profile.getAvailability()
        );
    }

    public ContractorProfileResponse toContractorProfile(ContractorProfile profile) {
        return new ContractorProfileResponse(
            profile.getId(),
            toUserSummary(profile.getUser()),
            profile.getCompanyName(),
            profile.getBusinessFocus()
        );
    }

    public ServiceBookingResponse toServiceBooking(ServiceBooking booking) {
        return new ServiceBookingResponse(
            booking.getId(),
            booking.getServiceCategory(),
            booking.getPreferredDate(),
            booking.getLocation(),
            booking.getDescription(),
            booking.getStatus(),
            toUserSummary(booking.getCustomer()),
            toUserSummary(booking.getAssignedWorker()),
            booking.getCreatedAt()
        );
    }

    public ConstructionJobResponse toConstructionJob(ConstructionJob job, List<ConstructionJobAssignment> assignments) {
        List<UserSummaryResponse> workers = assignments.stream()
            .map(ConstructionJobAssignment::getWorker)
            .map(this::toUserSummary)
            .toList();

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
            toUserSummary(job.getContractor()),
            workers,
            job.getCreatedAt()
        );
    }
}
