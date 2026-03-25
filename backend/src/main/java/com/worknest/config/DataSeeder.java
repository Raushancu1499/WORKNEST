package com.worknest.config;

import com.worknest.model.Role;
import com.worknest.model.User;
import com.worknest.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@worknest.com").isEmpty()) {
            userRepository.save(new User(
                "WORKNEST Admin",
                "admin@worknest.com",
                passwordEncoder.encode("Admin@123"),
                "9999999999",
                Role.ADMIN,
                "Bengaluru"
            ));
        }
    }
}
