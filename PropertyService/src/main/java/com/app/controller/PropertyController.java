package com.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.app.model.Property;
import com.app.model.PropertyImage;
import com.app.repository.PropertyRepository;
import com.app.service.PropertyService;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final PropertyService service;

    public PropertyController(PropertyService service, PropertyRepository propertyRepository) {
        this.service = service;
        this.propertyRepository = propertyRepository;
    }

    /* ============================
       HELPERS
    ============================ */

    private void validateGatewayHeaders(Long userId, String role) {
        if (userId == null || role == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing gateway authentication headers");
        }
    }

    private void requireAdmin(String role) {
        if (!"ADMIN".equals(role)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "ADMIN role required");
        }
    }

    /* ============================
       CUSTOMER (LOGGED IN)
       ✅ SINGLE POST /properties
       ✅ property_id will be set for images
    ============================ */

    @PostMapping
    public Property add(
            @RequestBody Property property,
            @RequestHeader(value = "X-USER-ID", required = false) Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false) String role) {

        validateGatewayHeaders(userId, role);

        if (!"CUSTOMER".equals(role)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only CUSTOMER can add property");
        }

        // ownerId from gateway
        property.setOwnerId(userId);

        // ✅ VERY IMPORTANT: attach property to each image
        if (property.getImages() != null) {
            for (PropertyImage img : property.getImages()) {
                img.setProperty(property); // ✅ sets FK property_id
            }
        }

        // ✅ Save once (Property + Images cascade)
        return service.addProperty(property);
    }

    /* ============================
       PUBLIC
    ============================ */

    @GetMapping
    public List<Property> getApproved() {
        return service.getApprovedProperties();
    }

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

        return service.filterProperties(city, propertyType, minPrice, maxPrice);
    }

    /* ============================
       ADMIN ONLY
    ============================ */

    @PutMapping("/{id}/approve")
    public Property approve(
            @PathVariable Long id,
            @RequestHeader(value = "X-USER-ID", required = false) Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false) String role) {

        validateGatewayHeaders(userId, role);
        requireAdmin(role);

        return service.approveProperty(id);
    }

    @PutMapping("/{id}/reject")
    public Property reject(
            @PathVariable Long id,
            @RequestHeader(value = "X-USER-ID", required = false) Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false) String role) {

        validateGatewayHeaders(userId, role);
        requireAdmin(role);

        return service.rejectProperty(id);
    }

    /* ============================
       ADMIN MASTER LIST
    ============================ */

    @GetMapping("/admin/list")
    public Page<Property> getAdminProperties(
            @RequestHeader(value = "X-USER-ID", required = false) Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false) String role,
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validateGatewayHeaders(userId, role);
        requireAdmin(role);

        Pageable pageable = PageRequest.of(page, size);
        return service.getPropertiesByStatusPaged(status, pageable);
    }

    @GetMapping("/admin/pending")
    public Page<Property> getPendingProperties(
            @RequestHeader(value = "X-USER-ID", required = false) Long userId,
            @RequestHeader(value = "X-USER-ROLE", required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validateGatewayHeaders(userId, role);
        requireAdmin(role);

        Pageable pageable = PageRequest.of(page, size);
        return service.getPropertiesByStatusPaged("PENDING", pageable);
    }
}
