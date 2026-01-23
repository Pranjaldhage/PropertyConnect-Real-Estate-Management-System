package com.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.model.Property;
import com.app.model.PropertyImage;
import com.app.repository.PropertyImageRepository;
import com.app.repository.PropertyRepository;

@Service
public class PropertyImageService {

    private final PropertyImageRepository imageRepo;
    private final PropertyRepository propertyRepo;

    public PropertyImageService(PropertyImageRepository imageRepo,
                                PropertyRepository propertyRepo) {
        this.imageRepo = imageRepo;
        this.propertyRepo = propertyRepo;
    }

    public PropertyImage uploadImage(Long propertyId,
                                     String imageUrl,
                                     Boolean isPrimary) {

        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        PropertyImage image = new PropertyImage();
        image.setImageUrl(imageUrl);
        image.setIsPrimary(isPrimary);
        image.setProperty(property);

        return imageRepo.save(image);
    }

    public List<PropertyImage> getImages(Long propertyId) {
        return imageRepo.findByPropertyId(propertyId);
    }
}
