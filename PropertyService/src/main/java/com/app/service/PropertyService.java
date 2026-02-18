package com.app.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import com.app.model.Property;
import com.app.repository.PropertyRepository;
import com.app.specification.PropertySpecification;

@Service
public class PropertyService {

    private final PropertyRepository repository;

    public PropertyService(PropertyRepository repository) {
        this.repository = repository;
    }

    /* ======================
       CUSTOMER
    ====================== */

    // Add property
    public Property addProperty(Property property) {
        property.setStatus("PENDING");
        return repository.save(property);
    }

    /* ======================
       ADMIN ACTIONS
    ====================== */

    // Approve property
    public Property approveProperty(Long id) {

        Property property = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));

        if (!"PENDING".equals(property.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING properties can be approved");
        }

        property.setStatus("APPROVED");
        return repository.save(property);
    }

    // Reject property
    public Property rejectProperty(Long id) {

        Property property = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));

        if (!"PENDING".equals(property.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING properties can be rejected");
        }

        property.setStatus("REJECTED");
        return repository.save(property);
    }

    /* ======================
       ADMIN LISTING
    ====================== */

    // 🔥 Generic admin list by status (paged)
    public Page<Property> getPropertiesByStatusPaged(
            String status,
            Pageable pageable
    ) {
        String s = (status == null || status.isBlank())
                ? "PENDING"
                : status.toUpperCase();

        return repository.findAll(
                PropertySpecification.hasStatus(s),
                pageable
        );
    }
    /* ======================
       PUBLIC
    ====================== */

    public List<Property> getApprovedProperties() {

        Specification<Property> spec =
                Specification.where(
                        PropertySpecification.hasStatus("APPROVED"));

        return repository.findAll(spec);
    }

    public List<Property> filterProperties(
            String city,
            String propertyType,
            Double minPrice,
            Double maxPrice) {

        Specification<Property> spec =
                Specification.where(
                        PropertySpecification.hasStatus("APPROVED"))
                        .and(PropertySpecification.hasCity(city))
                        .and(PropertySpecification.hasPropertyType(propertyType))
                        .and(PropertySpecification.priceBetween(
                                minPrice, maxPrice));

        return repository.findAll(spec);
    }

    public Property getPropertyById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));
    }
}
