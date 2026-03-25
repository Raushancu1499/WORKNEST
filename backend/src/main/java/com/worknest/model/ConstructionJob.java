package com.worknest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class ConstructionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "contractor_id")
    private User contractor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory workType;

    @Column(nullable = false)
    private Integer workersRequired;

    @Column(nullable = false)
    private Integer workersAssigned = 0;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private BigDecimal dailyWage;

    @Column(nullable = false, length = 1200)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConstructionJobStatus status = ConstructionJobStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ConstructionJob() {
    }

    public ConstructionJob(User contractor, ServiceCategory workType, Integer workersRequired, LocalDate startDate, LocalDate endDate, String location, BigDecimal dailyWage, String description) {
        this.contractor = contractor;
        this.workType = workType;
        this.workersRequired = workersRequired;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.dailyWage = dailyWage;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public User getContractor() {
        return contractor;
    }

    public void setContractor(User contractor) {
        this.contractor = contractor;
    }

    public ServiceCategory getWorkType() {
        return workType;
    }

    public void setWorkType(ServiceCategory workType) {
        this.workType = workType;
    }

    public Integer getWorkersRequired() {
        return workersRequired;
    }

    public void setWorkersRequired(Integer workersRequired) {
        this.workersRequired = workersRequired;
    }

    public Integer getWorkersAssigned() {
        return workersAssigned;
    }

    public void setWorkersAssigned(Integer workersAssigned) {
        this.workersAssigned = workersAssigned;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getDailyWage() {
        return dailyWage;
    }

    public void setDailyWage(BigDecimal dailyWage) {
        this.dailyWage = dailyWage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ConstructionJobStatus getStatus() {
        return status;
    }

    public void setStatus(ConstructionJobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
