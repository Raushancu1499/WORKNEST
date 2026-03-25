package com.worknest.service;

import com.worknest.dto.auth.AuthResponse;
import com.worknest.dto.auth.LoginRequest;
import com.worknest.dto.auth.RegisterRequest;
import com.worknest.model.ContractorProfile;
import com.worknest.model.Role;
import com.worknest.model.User;
import com.worknest.model.WorkerProfile;
import com.worknest.repository.ContractorProfileRepository;
import com.worknest.repository.UserRepository;
import com.worknest.repository.WorkerProfileRepository;
import com.worknest.security.JwtService;
import java.util.HashSet;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final ContractorProfileRepository contractorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        WorkerProfileRepository workerProfileRepository,
        ContractorProfileRepository contractorProfileRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.contractorProfileRepository = contractorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin registration is not allowed");
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User(
            request.fullName(),
            request.email(),
            passwordEncoder.encode(request.password()),
            request.phone(),
            request.role(),
            request.city()
        );
        user = userRepository.save(user);

        if (request.role() == Role.WORKER) {
            WorkerProfile profile = new WorkerProfile(
                user,
                request.skills() == null ? new HashSet<>() : request.skills(),
                request.experienceYears(),
                request.preferredLocation() == null ? request.city() : request.preferredLocation(),
                request.availability() == null ? "Weekdays" : request.availability()
            );
            workerProfileRepository.save(profile);
        }

        if (request.role() == Role.CONTRACTOR) {
            ContractorProfile profile = new ContractorProfile(user, request.companyName(), request.businessFocus());
            contractorProfileRepository.save(profile);
        }

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toAuthResponse(user);
    }

    public AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
            jwtService.generateToken(user),
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getCity()
        );
    }
}
