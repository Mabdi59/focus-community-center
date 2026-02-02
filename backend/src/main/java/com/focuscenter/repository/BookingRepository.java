package com.focuscenter.repository;

import com.focuscenter.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByFacilityId(Long facilityId);
    
    @Query("SELECT b FROM Booking b WHERE b.facility.id = :facilityId AND " +
           "((b.startTime < :endTime AND b.endTime > :startTime)) AND " +
           "b.status != 'CANCELLED'")
    List<Booking> findOverlappingBookings(
        @Param("facilityId") Long facilityId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}
