package com.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.model.PropertyImage;
import com.app.service.PropertyImageService;

//@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/properties")
public class PropertyImageController {

    private final PropertyImageService imageService;

    public PropertyImageController(PropertyImageService imageService) {
        this.imageService = imageService;
    }

    // Upload image (URL-based)
    @PostMapping("/{propertyId}/images")
    public PropertyImage uploadImage(
            @PathVariable Long propertyId,
            @RequestParam String imageUrl,
            @RequestParam(defaultValue = "false") Boolean isPrimary) {

        return imageService.uploadImage(propertyId, imageUrl, isPrimary);
    }

    // Get images of a property
    @GetMapping("/{propertyId}/images")
    public List<PropertyImage> getImages(@PathVariable Long propertyId) {
        return imageService.getImages(propertyId);
    }
    
    
}
