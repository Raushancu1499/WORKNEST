package com.worknest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_id", "worker_id"})
})
public class ConstructionJobAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id")
    private ConstructionJob job;

    @ManyToOne(optional = false)
    @JoinColumn(name = "worker_id")
    private User worker;

    @Column(nullable = false)
    private LocalDateTime acceptedAt = LocalDateTime.now();

    public ConstructionJobAssignment() {
    }

    public ConstructionJobAssignment(ConstructionJob job, User worker) {
        this.job = job;
        this.worker = worker;
    }

    public Long getId() {
        return id;
    }

    public ConstructionJob getJob() {
        return job;
    }

    public User getWorker() {
        return worker;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }
}
