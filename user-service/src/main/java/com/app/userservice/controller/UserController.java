package com.app.userservice.controller;

import com.app.userservice.dto.ProfileAddressRequest;
import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;
import com.app.userservice.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /* ============================
       PROFILE
    ============================ */

    @PostMapping("/profile")
    public UserProfile saveProfile(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role,
            @RequestBody UserProfile profile) {

        validateGatewayHeaders(userId, role);

        profile.setUserId(userId);

        return userService.createOrUpdateProfile(profile);
    }

    @GetMapping("/profile")
    public UserProfile getProfile(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role) {

        validateGatewayHeaders(userId, role);

        UserProfile profile =
                userService.getProfileByUserId(userId);

        return profile != null
                ? profile
                : new UserProfile();
    }
    
    @PutMapping("/profile")
    public UserProfile updateProfile(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role,
            @RequestBody UserProfile profile) {

        validateGatewayHeaders(userId, role);

        profile.setUserId(userId);

        return userService.createOrUpdateProfile(profile);
    }


    /* ============================
       ADDRESS
    ============================ */

    @PostMapping("/address")
    public Address addAddress(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role,
            @RequestBody Address address) {

        validateGatewayHeaders(userId, role);

        address.setUserId(userId);

        return userService.addAddress(address);
    }

    @GetMapping("/address")
    public List<Address> getAddresses(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role) {

        validateGatewayHeaders(userId, role);

        return userService.getAddresses(userId);
    }
    
    @PutMapping("/profile-full")
    public void updateProfileAndAddress(
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role,
            @RequestBody ProfileAddressRequest request) {

        validateGatewayHeaders(userId, role);

        userService.saveProfileAndAddress(
                userId,
                request.getProfile(),
                request.getAddress()
        );
    }
    
    @PostMapping("/profile-full")
    public void saveProfileAndAddress(
    		
            @RequestHeader(value = "X-USER-ID", required = false)
                    Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false)
                    String role,
            @RequestBody ProfileAddressRequest request) {

        validateGatewayHeaders(userId, role);

        userService.saveProfileAndAddress(
                userId,
                request.getProfile(),
                request.getAddress()
        );
    }


    /* ============================
       SECURITY
    ============================ */

    private void validateGatewayHeaders(
            Long userId,
            String role) {

        if (userId == null || role == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing gateway authentication headers"
            );
        }

        // Optional role validation
        if (!role.equals("CUSTOMER")
                && !role.equals("ADMIN")) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invalid role"
            );
        }
    }
}
