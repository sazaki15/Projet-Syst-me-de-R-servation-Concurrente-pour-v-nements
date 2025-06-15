package com.reservation.controller;

import com.reservation.dto.ReservationRequest;
import com.reservation.dto.ReservationResponse;
import com.reservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        // Get the authenticated user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        ReservationResponse response = reservationService.createReservation(request, userEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ReservationResponse>> getCurrentUserReservations() {
        // Get the authenticated user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        List<ReservationResponse> reservations = reservationService.getUserReservationsByEmail(userEmail);
        return ResponseEntity.ok(reservations);
    }

    // This endpoint is kept for compatibility but should be restricted to admins
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(@PathVariable Long userId) {
        List<ReservationResponse> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{reservationCode}")
    public ResponseEntity<ReservationResponse> getReservationByCode(@PathVariable String reservationCode) {
        ReservationResponse reservation = reservationService.getReservationByCode(reservationCode);
        return ResponseEntity.ok(reservation);
    }

    @DeleteMapping("/{reservationCode}")
    public ResponseEntity<Void> cancelReservation(@PathVariable String reservationCode) {
        // Get the authenticated user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        reservationService.cancelReservation(reservationCode, userEmail);
        return ResponseEntity.noContent().build();
    }
}
