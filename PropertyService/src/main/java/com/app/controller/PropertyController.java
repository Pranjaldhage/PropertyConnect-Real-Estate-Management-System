package com.app.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.app.model.Property;
import com.app.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    @PostMapping
    public Property add(@RequestBody Property property) {
        return service.addProperty(property);
    }

    @PutMapping("/{id}/approve")
    public Property approve(@PathVariable Long id) {
        return service.approveProperty(id);
    }

    @GetMapping
    public List<Property> getApproved() {
        return service.getApprovedProperties();
    }

    @GetMapping("/price/{price}")
    public List<Property> filterByPrice(@PathVariable Double price) {
        return service.filterByPrice(price);
    }
    
    @GetMapping("/type/{type}")
    public List<Property> filterByType(@PathVariable String type) {
        return service.filterByPropertyType(type);
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

}
