package com.worknest.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class ContractorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String companyName;

    private String businessFocus;

    public ContractorProfile() {
    }

    public ContractorProfile(User user, String companyName, String businessFocus) {
        this.user = user;
        this.companyName = companyName;
        this.businessFocus = businessFocus;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getBusinessFocus() {
        return businessFocus;
    }

    public void setBusinessFocus(String businessFocus) {
        this.businessFocus = businessFocus;
    }
}
