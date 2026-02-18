package com.app.userservice.service;

import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;

import java.util.List;

public interface UserService {

    // PROFILE
    UserProfile createOrUpdateProfile(UserProfile profile);
    UserProfile getProfileByUserId(Long userId);

    // ADDRESS
    Address addAddress(Address address);
    List<Address> getAddresses(Long userId);

    // ✅ PROFILE + ADDRESS (combined)
    void saveProfileAndAddress(Long userId, UserProfile profile, Address address);
}
