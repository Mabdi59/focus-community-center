package com.focuscenter.service;

import com.focuscenter.config.SiteInfo;
import com.focuscenter.dto.FacilityRequest;
import com.focuscenter.model.Facility;
import com.focuscenter.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public List<Facility> getAvailableFacilities() {
        return facilityRepository.findByIsAvailable(true);
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    public Facility createFacility(FacilityRequest request) {
        Facility facility = new Facility();
        facility.setName(request.getName());
        facility.setDescription(request.getDescription());
        facility.setCapacity(request.getCapacity());
        facility.setHourlyRate(request.getHourlyRate());
        facility.setType(request.getType());
        facility.setIsAvailable(request.getIsAvailable());
        facility.setImageUrl(request.getImageUrl());
        facility.setAddress(SiteInfo.FACILITY_ADDRESS);
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, FacilityRequest request) {
        Facility facility = getFacilityById(id);
        facility.setName(request.getName());
        facility.setDescription(request.getDescription());
        facility.setCapacity(request.getCapacity());
        facility.setHourlyRate(request.getHourlyRate());
        facility.setType(request.getType());
        facility.setIsAvailable(request.getIsAvailable());
        facility.setImageUrl(request.getImageUrl());
        facility.setAddress(SiteInfo.FACILITY_ADDRESS);
        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
}
