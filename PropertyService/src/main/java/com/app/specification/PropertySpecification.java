package com.app.specification;

import org.springframework.data.jpa.domain.Specification;

import com.app.model.Property;

public class PropertySpecification {

    public static Specification<Property> hasCity(String city) {
        return (root, query, cb) ->
                city == null ? null : cb.equal(root.get("city"), city);
    }

    public static Specification<Property> hasPropertyType(String type) {
        return (root, query, cb) ->
                type == null ? null : cb.equal(root.get("propertyType"), type);
    }

    public static Specification<Property> priceBetween(
            Double minPrice,
            Double maxPrice) {

        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null)
                return null;

            if (minPrice != null && maxPrice != null)
                return cb.between(root.get("price"), minPrice, maxPrice);

            if (minPrice != null)
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);

            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Property> isApproved() {
        return (root, query, cb) ->
                cb.equal(root.get("status"), "APPROVED");
    }
}
