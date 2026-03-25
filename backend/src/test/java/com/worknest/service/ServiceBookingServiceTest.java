package com.worknest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.worknest.dto.service.ServiceBookingResponse;
import com.worknest.model.Role;
import com.worknest.model.ServiceBooking;
import com.worknest.model.ServiceBookingStatus;
import com.worknest.model.ServiceCategory;
import com.worknest.model.User;
import com.worknest.repository.ServiceBookingRepository;
import com.worknest.repository.WorkerProfileRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ServiceBookingServiceTest {

    @Mock
    private ServiceBookingRepository serviceBookingRepository;

    @Mock
    private WorkerProfileRepository workerProfileRepository;

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private MapperService mapperService;

    private ServiceBookingService serviceBookingService;

    @BeforeEach
    void setUp() {
        serviceBookingService = new ServiceBookingService(
            serviceBookingRepository,
            workerProfileRepository,
            currentUserService,
            mapperService
        );
    }

    @Test
    void acceptAssignsWorkerAndMovesBookingToAccepted() {
        User worker = user(2L, "Worker", Role.WORKER);
        User customer = user(1L, "Customer", Role.CUSTOMER);
        ServiceBooking booking = booking(5L, customer, ServiceBookingStatus.PENDING);

        when(currentUserService.requireRole(Role.WORKER)).thenReturn(worker);
        when(serviceBookingRepository.findById(5L)).thenReturn(Optional.of(booking));
        when(serviceBookingRepository.save(any(ServiceBooking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapperService.toServiceBooking(any(ServiceBooking.class))).thenAnswer(invocation -> mapBooking(invocation.getArgument(0)));

        ServiceBookingResponse response = serviceBookingService.accept(5L);

        assertEquals(ServiceBookingStatus.ACCEPTED, response.status());
        assertEquals(worker.getId(), booking.getAssignedWorker().getId());
        verify(serviceBookingRepository).save(booking);
    }

    @Test
    void patchRejectsAcceptedTransition() {
        User customer = user(1L, "Customer", Role.CUSTOMER);
        ServiceBooking booking = booking(7L, customer, ServiceBookingStatus.PENDING);

        when(currentUserService.getCurrentUser()).thenReturn(customer);
        when(serviceBookingRepository.findById(7L)).thenReturn(Optional.of(booking));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> serviceBookingService.updateStatus(7L, ServiceBookingStatus.ACCEPTED)
        );

        assertEquals(400, exception.getStatusCode().value());
    }

    private User user(Long id, String name, Role role) {
        User user = new User(name, name.toLowerCase() + "@worknest.com", "secret", "9999999999", role, "Bengaluru");
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }

    private ServiceBooking booking(Long id, User customer, ServiceBookingStatus status) {
        ServiceBooking booking = new ServiceBooking(
            customer,
            ServiceCategory.PLUMBING,
            LocalDate.now().plusDays(1),
            "Bengaluru",
            "Pipe leak"
        );
        ReflectionTestUtils.setField(booking, "id", id);
        booking.setStatus(status);
        ReflectionTestUtils.setField(booking, "createdAt", LocalDateTime.now());
        return booking;
    }

    private ServiceBookingResponse mapBooking(ServiceBooking booking) {
        return new ServiceBookingResponse(
            booking.getId(),
            booking.getServiceCategory(),
            booking.getPreferredDate(),
            booking.getLocation(),
            booking.getDescription(),
            booking.getStatus(),
            null,
            null,
            booking.getCreatedAt()
        );
    }
}
