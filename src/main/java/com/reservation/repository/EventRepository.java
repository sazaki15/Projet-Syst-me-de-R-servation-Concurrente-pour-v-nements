package com.reservation.repository;

import com.reservation.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdWithLock(@Param("id") Long id);
    
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);
    
    List<Event> findByAvailableSeatsGreaterThanOrderByEventDateAsc(Integer seats);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate > :now AND e.availableSeats > 0")
    List<Event> findUpcomingEventsWithAvailableSeats(@Param("now") LocalDateTime now);
}
