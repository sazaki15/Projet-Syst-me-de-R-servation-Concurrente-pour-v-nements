package com.reservation.repository;

import com.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUserId(Long userId);
    
    List<Reservation> findByEventId(Long eventId);
    
    Optional<Reservation> findByReservationCode(String reservationCode);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    Long countConfirmedReservationsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT SUM(r.numberOfSeats) FROM Reservation r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    Integer sumReservedSeatsByEventId(@Param("eventId") Long eventId);
}
