package com.app.service;

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

    // Add property (Agent)
    public Property addProperty(Property property) {
        property.setStatus("PENDING");
        return repository.save(property);
    }

    // Admin approval
    public Property approveProperty(Long id) {
        Property property = repository.findById(id).orElseThrow();
        property.setStatus("APPROVED");
        return repository.save(property);
    }

    // Customer view
    public List<Property> getApprovedProperties() {
        return repository.findByStatus("APPROVED");
    }

    // Price filter
    public List<Property> filterByPrice(Double price) {
        return repository.findByPriceLessThanEqualAndStatus(price, "APPROVED");
    }
    
    // Type filter
    public List<Property> filterByPropertyType(String type) {
        return repository.findByPropertyTypeAndStatus(type, "APPROVED");
    }
    
    //Combined Filters
    public List<Property> filterProperties(
            String city,
            String propertyType,
            Double minPrice,
            Double maxPrice) {

        Specification<Property> spec =
                Specification.where(PropertySpecification.isApproved())
                        .and(PropertySpecification.hasCity(city))
                        .and(PropertySpecification.hasPropertyType(propertyType))
                        .and(PropertySpecification.priceBetween(minPrice, maxPrice));

        return repository.findAll(spec);
    }

}
