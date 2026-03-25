package com.worknest.service;

import com.worknest.dto.service.ServiceBookingRequest;
import com.worknest.dto.service.ServiceBookingResponse;
import com.worknest.model.Role;
import com.worknest.model.ServiceBooking;
import com.worknest.model.ServiceBookingStatus;
import com.worknest.model.User;
import com.worknest.repository.ServiceBookingRepository;
import com.worknest.repository.WorkerProfileRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ServiceBookingService {

    private final ServiceBookingRepository serviceBookingRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapperService;

    public ServiceBookingService(
        ServiceBookingRepository serviceBookingRepository,
        WorkerProfileRepository workerProfileRepository,
        CurrentUserService currentUserService,
        MapperService mapperService
    ) {
        this.serviceBookingRepository = serviceBookingRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.currentUserService = currentUserService;
        this.mapperService = mapperService;
    }

    @Transactional
    public ServiceBookingResponse create(ServiceBookingRequest request) {
        User customer = currentUserService.requireRole(Role.CUSTOMER);
        ServiceBooking booking = new ServiceBooking(
            customer,
            request.serviceCategory(),
            request.preferredDate(),
            request.location(),
            request.description()
        );
        return mapperService.toServiceBooking(serviceBookingRepository.save(booking));
    }

    public List<ServiceBookingResponse> myBookings() {
        User user = currentUserService.getCurrentUser();
        List<ServiceBooking> bookings;
        if (user.getRole() == Role.CUSTOMER) {
            bookings = serviceBookingRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId());
        } else if (user.getRole() == Role.WORKER) {
            bookings = serviceBookingRepository.findByAssignedWorkerIdOrderByCreatedAtDesc(user.getId());
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only customers and workers can view personal bookings");
        }
        return bookings.stream().map(mapperService::toServiceBooking).toList();
    }

    public List<ServiceBookingResponse> availableForWorkers() {
        User worker = currentUserService.requireRole(Role.WORKER);
        var profile = workerProfileRepository.findByUserId(worker.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Create worker profile first"));

        String preferred = normalize(profile.getPreferredLocation());

        return serviceBookingRepository.findByStatusOrderByCreatedAtDesc(ServiceBookingStatus.PENDING).stream()
            .filter(booking -> profile.getSkills().contains(booking.getServiceCategory()))
            .filter(booking -> locationMatches(preferred, booking.getLocation(), booking.getCustomer().getCity()))
            .map(mapperService::toServiceBooking)
            .toList();
    }

    @Transactional
    public ServiceBookingResponse accept(Long bookingId) {
        User worker = currentUserService.requireRole(Role.WORKER);
        ServiceBooking booking = getById(bookingId);
        if (booking.getStatus() != ServiceBookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending bookings can be accepted");
        }

        booking.setAssignedWorker(worker);
        booking.setStatus(ServiceBookingStatus.ACCEPTED);
        return mapperService.toServiceBooking(serviceBookingRepository.save(booking));
    }

    @Transactional
    public ServiceBookingResponse updateStatus(Long bookingId, ServiceBookingStatus targetStatus) {
        User user = currentUserService.getCurrentUser();
        ServiceBooking booking = getById(bookingId);

        boolean canUpdate = user.getRole() == Role.ADMIN
            || booking.getCustomer().getId().equals(user.getId())
            || (booking.getAssignedWorker() != null && booking.getAssignedWorker().getId().equals(user.getId()));

        if (!canUpdate) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this booking");
        }

        ServiceBookingStatus current = booking.getStatus();
        if (targetStatus == ServiceBookingStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use the accept endpoint to accept a booking");
        }

        boolean validTransition =
            (targetStatus == ServiceBookingStatus.COMPLETED && current == ServiceBookingStatus.ACCEPTED) ||
            (targetStatus == ServiceBookingStatus.CANCELLED && current != ServiceBookingStatus.COMPLETED);

        if (!validTransition && targetStatus != current) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status transition");
        }

        booking.setStatus(targetStatus);
        return mapperService.toServiceBooking(serviceBookingRepository.save(booking));
    }

    public List<ServiceBookingResponse> allBookings() {
        currentUserService.requireRole(Role.ADMIN);
        return serviceBookingRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(mapperService::toServiceBooking)
            .toList();
    }

    private ServiceBooking getById(Long bookingId) {
        return serviceBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service booking not found"));
    }

    private boolean locationMatches(String preferredLocation, String bookingLocation, String bookingCity) {
        if (preferredLocation.isBlank()) {
            return true;
        }
        String booking = normalize(bookingLocation);
        String city = normalize(bookingCity);
        return booking.contains(preferredLocation) || preferredLocation.contains(booking) || city.contains(preferredLocation);
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
    }
}
