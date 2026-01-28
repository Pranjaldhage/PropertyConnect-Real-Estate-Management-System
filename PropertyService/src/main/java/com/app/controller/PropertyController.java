package com.app.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.app.model.Property;
import com.app.service.PropertyService;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    /* ============================
       CUSTOMER / PUBLIC
    ============================ */

    // add new property (logged in users)
    @PostMapping
    public Property add(
            @RequestBody Property property,
            @RequestHeader("X-USER-ID") Long userId) {

        property.setOwnerId(userId);
        return service.addProperty(property);
    }

    // get approved only (public)
    @GetMapping
    public List<Property> getApproved() {
        return service.getApprovedProperties();
    }

    // get property by id (public)
    @GetMapping("/{id}")
    public Property getById(@PathVariable Long id) {
        return service.getPropertyById(id);
    }

    @GetMapping("/search")
    public List<Property> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        return service.filterProperties(
                city, propertyType, minPrice, maxPrice);
    }

    /* ============================
       ADMIN ONLY
    ============================ */

    // approve property
    @PutMapping("/{id}/approve")
    public Property approve(
            @PathVariable Long id,
            @RequestHeader("X-USER-ROLE") String role) {

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only ADMIN can approve property");
        }

        return service.approveProperty(id);
    }

    // reject property
    @PutMapping("/{id}/reject")
    public Property reject(
            @PathVariable Long id,
            @RequestHeader("X-USER-ROLE") String role) {

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only ADMIN can reject property");
        }

        return service.rejectProperty(id);
    }

    /* ===================================================
       🔥 ADMIN MASTER LIST — ALL STATUSES
       /properties/admin/list?status=PENDING
       /properties/admin/list?status=APPROVED
       /properties/admin/list?status=REJECTED
    =================================================== */

    @GetMapping("/admin/list")
    public Page<Property> getAdminProperties(
            @RequestHeader("X-USER-ROLE") String role,

            @RequestParam String status,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only ADMIN allowed");
        }

        Pageable pageable = PageRequest.of(page, size);

        return service.getPropertiesByStatusPaged(
                status,
                pageable
        );
    }

    /* ==================================
       Legacy endpoint (optional)
    ================================== */

    @GetMapping("/admin/pending")
    public Page<Property> getPendingProperties(
            @RequestHeader("X-USER-ROLE") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only ADMIN can view pending properties");
        }

        Pageable pageable = PageRequest.of(page, size);

        return service.getPropertiesByStatusPaged(
                "PENDING",
                pageable
        );
    }
}
