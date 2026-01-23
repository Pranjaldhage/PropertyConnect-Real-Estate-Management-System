package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.app.model.Property;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long>,JpaSpecificationExecutor<Property> {

    List<Property> findByStatus(String status);

    List<Property> findByPriceLessThanEqualAndStatus(Double price, String status);

    List<Property> findByCityAndStatus(String city, String status);
    
    List<Property> findByPropertyTypeAndStatus(String propertyType, String status);

}
