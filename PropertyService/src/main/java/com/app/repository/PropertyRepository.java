package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.app.model.Property;

public interface PropertyRepository
        extends JpaRepository<Property, Long>,
                JpaSpecificationExecutor<Property> {

    // 🔥 SpecificationExecutor handles all filtering
    // No extra methods needed here anymore
}
