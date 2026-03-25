package com.worknest.controller;

import com.worknest.dto.service.ServiceBookingRequest;
import com.worknest.dto.service.ServiceBookingResponse;
import com.worknest.dto.service.ServiceBookingStatusRequest;
import com.worknest.service.ServiceBookingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/service-bookings")
public class ServiceBookingController {

    private final ServiceBookingService serviceBookingService;

    public ServiceBookingController(ServiceBookingService serviceBookingService) {
        this.serviceBookingService = serviceBookingService;
    }

    @PostMapping
    public ServiceBookingResponse create(@Valid @RequestBody ServiceBookingRequest request) {
        return serviceBookingService.create(request);
    }

    @GetMapping("/my")
    public List<ServiceBookingResponse> myBookings() {
        return serviceBookingService.myBookings();
    }

    @GetMapping("/available")
    public List<ServiceBookingResponse> availableForWorkers() {
        return serviceBookingService.availableForWorkers();
    }

    @PostMapping("/{id}/accept")
    public ServiceBookingResponse accept(@PathVariable Long id) {
        return serviceBookingService.accept(id);
    }

    @PatchMapping("/{id}/status")
    public ServiceBookingResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ServiceBookingStatusRequest request) {
        return serviceBookingService.updateStatus(id, request.status());
    }
}
