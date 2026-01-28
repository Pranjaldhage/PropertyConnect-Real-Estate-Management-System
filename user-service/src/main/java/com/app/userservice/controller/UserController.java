package com.app.userservice.controller;

import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;
import com.app.userservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // userId comes from API Gateway (JWT → Header)
    @PostMapping("/profile")
    public UserProfile saveProfile(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody UserProfile profile) {

        profile.setUserId(userId);
        return userService.createOrUpdateProfile(profile);
    }

    @GetMapping("/profile")
    public UserProfile getProfile(
            @RequestHeader("X-USER-ID") Long userId) {

        UserProfile profile = userService.getProfileByUserId(userId);

        if (profile == null) {
            return new UserProfile(); // empty profile for new users
        }

        return profile;
    }


    @PostMapping("/address")
    public Address addAddress(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestBody Address address) {

        address.setUserId(userId);
        return userService.addAddress(address);
    }

    @GetMapping("/address")
    public List<Address> getAddresses(
            @RequestHeader("X-USER-ID") Long userId) {

        return userService.getAddresses(userId);
    }
}

