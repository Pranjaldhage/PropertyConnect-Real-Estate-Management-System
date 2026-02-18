package com.app.userservice.repository;

import com.app.userservice.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // Existing method (used by your /users/address GET)
    List<Address> findByUserId(Long userId);

    // ✅ Key method: fetch existing address for user (only 1 address per user)
    Optional<Address> findFirstByUserId(Long userId);
}
