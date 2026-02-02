package com.focuscenter.controller;

import com.focuscenter.dto.BookingRequest;
import com.focuscenter.model.Booking;
import com.focuscenter.model.User;
import com.focuscenter.repository.UserRepository;
import com.focuscenter.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        User user = getCurrentUser();
        return ResponseEntity.ok(bookingService.getBookingsByUserId(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        enforceBookingAccess(booking);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<Booking>> getBookingsByFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(bookingService.getBookingsByFacilityId(facilityId));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(bookingService.createBooking(user.getId(), request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        enforceBookingAccess(booking);
        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void enforceBookingAccess(Booking booking) {
        if (isStaffOrAdmin()) {
            return;
        }
        User user = getCurrentUser();
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to access this booking");
        }
    }

    private boolean isStaffOrAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_STAFF")
                        || authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
