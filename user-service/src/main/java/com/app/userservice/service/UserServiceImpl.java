package com.app.userservice.service;

import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;
import com.app.userservice.repository.AddressRepository;
import com.app.userservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;
    private final AddressRepository addressRepository;

    public UserServiceImpl(UserProfileRepository userProfileRepository,
                           AddressRepository addressRepository) {
        this.userProfileRepository = userProfileRepository;
        this.addressRepository = addressRepository;
    }

    /* ==========================
            PROFILE
    ========================== */

    @Override
    public UserProfile createOrUpdateProfile(UserProfile profile) {

        UserProfile existing = userProfileRepository
                .findByUserId(profile.getUserId())
                .orElse(null);

        if (existing != null) {
            existing.setName(profile.getName());
            existing.setGender(profile.getGender());
            existing.setMobileNumber(profile.getMobileNumber());

            // ✅ City removed (stored in Address only)
            // existing.setCity(profile.getCity());

            return userProfileRepository.save(existing);
        }

        // ✅ also make sure new profile doesn't need city
        return userProfileRepository.save(profile);
    }


    @Override
    public UserProfile getProfileByUserId(Long userId) {
        return userProfileRepository.findByUserId(userId).orElse(null);
    }

    /* ==========================
            ADDRESS
    ========================== */

    @Override
    public Address addAddress(Address address) {
        if (address.getIsDefault() == null) {
            address.setIsDefault(false);
        }
        return addressRepository.save(address); // inserts if id is null
    }

    @Override
    public List<Address> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    /* ==========================
       ✅ FIXED: PROFILE + ADDRESS
       Same userId => UPDATE address
       Only first time => INSERT
    ========================== */

    @Override
    @Transactional
    public void saveProfileAndAddress(Long userId, UserProfile profile, Address address) {

        // 1) PROFILE UPDATE/INSERT
        if (profile != null) {
            profile.setUserId(userId);
            createOrUpdateProfile(profile);
        }

        // 2) ADDRESS UPDATE/INSERT (NO DUPLICATES)
        if (address != null) {

            Address existing =
                    addressRepository.findFirstByUserId(userId).orElse(null);

            if (existing != null) {
                // ✅ UPDATE existing row
                existing.setAddressLine1(address.getAddressLine1());
                existing.setAddressLine2(address.getAddressLine2());
                existing.setCity(address.getCity());
                existing.setState(address.getState());
                existing.setPostalCode(address.getPostalCode());
                existing.setCountry(address.getCountry());

                // keep old default flag unless you want to update it
                // existing.setIsDefault(address.getIsDefault());

                addressRepository.save(existing);

            } else {
                // ✅ INSERT only first time
                address.setUserId(userId);
                if (address.getIsDefault() == null) {
                    address.setIsDefault(false);
                }
                addressRepository.save(address);
            }
        }
    }
}
