package com.focuscenter.service;

import com.focuscenter.dto.BookingRequest;
import com.focuscenter.model.Booking;
import com.focuscenter.model.Facility;
import com.focuscenter.model.User;
import com.focuscenter.repository.BookingRepository;
import com.focuscenter.repository.FacilityRepository;
import com.focuscenter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByFacilityId(Long facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }

    public List<Booking> getActiveBookingsByFacilityInRange(Long facilityId, LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findActiveBookingsInRange(
                facilityId,
                start,
                end,
                getActiveStatuses()
        );
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        if (Boolean.FALSE.equals(facility.getIsAvailable())) {
            throw new RuntimeException("Facility is not available for booking");
        }

        if (request.getEndTime().isBefore(request.getStartTime())
                || request.getEndTime().isEqual(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Bookings must start in the future");
        }

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                request.getFacilityId(),
                request.getStartTime(),
                request.getEndTime(),
                getActiveStatuses()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException("The selected time slot is not available");
        }

        // Calculate total price based on hours
        long minutes = Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
        if (minutes <= 0) {
            throw new RuntimeException("Invalid booking duration");
        }
        long billableHours = Math.max(1, (long) Math.ceil(minutes / 60.0));
        double totalPrice = facility.getHourlyRate() * billableHours;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFacility(facility);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setTotalPrice(totalPrice);
        booking.setNotes(request.getNotes());
        booking.setStatus(Booking.BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private EnumSet<Booking.BookingStatus> getActiveStatuses() {
        return EnumSet.of(Booking.BookingStatus.PENDING, Booking.BookingStatus.CONFIRMED);
    }
}
