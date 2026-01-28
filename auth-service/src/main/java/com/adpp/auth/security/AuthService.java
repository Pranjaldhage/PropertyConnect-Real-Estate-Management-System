package com.adpp.auth.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.adpp.auth.client.UserServiceClient;
import com.adpp.auth.entity.User;
import com.adpp.auth.enums.Role;
import com.adpp.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserServiceClient userServiceClient; // 🔥 call user-service


    /* ================= REGISTER ================= */

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }

        user.setStatus("ACTIVE");
        user.setEmailVerified(false);

        // save auth user
        User savedUser = userRepository.save(user);

        // 🔥 AUTO CREATE PROFILE IN USER-SERVICE
        userServiceClient.createProfile(savedUser.getId());

        return savedUser;
    }

    /* ================= LOGIN ================= */

    public String login(String email, String password) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
