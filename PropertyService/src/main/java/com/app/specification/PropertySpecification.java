package com.app.specification;

import org.springframework.data.jpa.domain.Specification;

import com.app.model.Property;

public class PropertySpecification {

    /* ======================
       COMMON FILTERS
    ====================== */

    public static Specification<Property> hasCity(String city) {
        return (root, query, cb) ->
                city == null || city.isBlank()
                        ? null
                        : cb.equal(root.get("city"), city);
    }

    public static Specification<Property> hasPropertyType(String type) {
        return (root, query, cb) ->
                type == null || type.isBlank()
                        ? null
                        : cb.equal(root.get("propertyType"), type);
    }

    public static Specification<Property> hasStatus(String status) {
        return (root, query, cb) ->
                status == null
                        ? null
                        : cb.equal(root.get("status"), status);
    }

    /* ======================
       PRICE FILTER
    ====================== */

    public static Specification<Property> priceBetween(
            Double minPrice,
            Double maxPrice) {

        return (root, query, cb) -> {

            if (minPrice == null && maxPrice == null)
                return null;

            if (minPrice != null && maxPrice != null)
                return cb.between(
                        root.get("price"),
                        minPrice,
                        maxPrice);

            if (minPrice != null)
                return cb.greaterThanOrEqualTo(
                        root.get("price"),
                        minPrice);

            return cb.lessThanOrEqualTo(
                    root.get("price"),
                    maxPrice);
        };
    }

    /* ======================
       STATUS SHORTCUTS
    ====================== */

    public static Specification<Property> isApproved() {
        return hasStatus("APPROVED");
    }

    public static Specification<Property> isPending() {
        return hasStatus("PENDING");
    }

    public static Specification<Property> isRejected() {
        return hasStatus("REJECTED");
    }
}
