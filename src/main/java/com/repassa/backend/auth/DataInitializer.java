package com.repassa.backend.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@repassa.com")) {
            User admin = new User();
            admin.setName("Admin RePassa");
            admin.setEmail("admin@repassa.com");
            admin.setPassword(passwordEncoder.encode("secret123"));
            admin.setPhone("(11) 99999-0000");
            admin.setCity("Sao Paulo");
            userRepository.save(admin);
        }
    }
}
