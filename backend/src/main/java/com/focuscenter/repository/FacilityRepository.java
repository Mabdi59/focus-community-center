package com.focuscenter.repository;

import com.focuscenter.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByIsAvailable(Boolean isAvailable);
    List<Facility> findByType(String type);
}
