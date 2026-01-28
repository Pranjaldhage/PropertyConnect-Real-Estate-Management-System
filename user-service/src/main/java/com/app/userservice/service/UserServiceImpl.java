package com.app.userservice.service;

import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;
import com.app.userservice.repository.AddressRepository;
import com.app.userservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserProfileRepository profileRepository;
    private final AddressRepository addressRepository;

    public UserServiceImpl(UserProfileRepository profileRepository,
                           AddressRepository addressRepository) {
        this.profileRepository = profileRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public UserProfile createOrUpdateProfile(UserProfile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public UserProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElse(null);
    }


    @Override
    public Address addAddress(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }
}

