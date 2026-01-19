package com.adpp.auth.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.adpp.auth.entity.User;
import com.adpp.auth.security.AuthService;
import com.adpp.auth.dto.RegisterRequest;
import com.adpp.auth.dto.LoginRequest;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
      //  user.setRole(request.getRole()); // may be null → default handled in service

        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
    

        @GetMapping("/gate")
        public String test() {
            return "GATEWAY JWT OK";
        }
    


}
