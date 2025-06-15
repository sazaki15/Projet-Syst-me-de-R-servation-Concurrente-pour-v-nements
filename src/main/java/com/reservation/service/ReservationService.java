package com.reservation.service;

import com.reservation.dto.EventResponse;
import com.reservation.dto.ReservationRequest;
import com.reservation.dto.ReservationResponse;
import com.reservation.exception.InsufficientSeatsException;
import com.reservation.exception.ResourceNotFoundException;
import com.reservation.model.Event;
import com.reservation.model.Reservation;
import com.reservation.model.User;
import com.reservation.repository.EventRepository;
import com.reservation.repository.ReservationRepository;
import com.reservation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ReservationResponse createReservation(ReservationRequest request, String userEmail) {
        try {
            logger.info("Creating reservation for user: {}, event: {}, seats: {}", 
                       userEmail, request.getEventId(), request.getNumberOfSeats());
            
            // Get user by email from authentication context
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> {
                        logger.error("User not found with email: {}", userEmail);
                        return new ResourceNotFoundException("Utilisateur non trouvé avec email: " + userEmail);
                    });
            
            logger.debug("User found: {}", user.getId());

            // Utilisation du verrouillage pessimiste pour éviter les conditions de course
            Event event = eventRepository.findByIdWithLock(request.getEventId())
                    .orElseThrow(() -> {
                        logger.error("Event not found with id: {}", request.getEventId());
                        return new ResourceNotFoundException("Événement non trouvé avec id: " + request.getEventId());
                    });
            
            logger.debug("Event found: {}, available seats: {}", event.getId(), event.getAvailableSeats());

            // Vérification de la disponibilité des places
            if (!event.hasAvailableSeats(request.getNumberOfSeats())) {
                logger.warn("Not enough seats available. Requested: {}, Available: {}", 
                           request.getNumberOfSeats(), event.getAvailableSeats());
                throw new InsufficientSeatsException(
                    "Pas assez de places disponibles. Places restantes: " + event.getAvailableSeats()
                );
            }

            // Réservation des places
            event.reserveSeats(request.getNumberOfSeats());
            eventRepository.save(event);
            logger.debug("Reserved {} seats for event {}, remaining: {}", 
                        request.getNumberOfSeats(), event.getId(), event.getAvailableSeats());

            // Création de la réservation avec Lombok builder
            Reservation reservation = Reservation.builder()
                .user(user)
                .event(event)
                .numberOfSeats(request.getNumberOfSeats())
                .totalPrice(event.getPrice() * request.getNumberOfSeats())
                .status(Reservation.ReservationStatus.CONFIRMED)
                .reservationDate(LocalDateTime.now())
                .reservationCode(generateReservationCode())
                .build();
                
            reservation = reservationRepository.save(reservation);
            logger.info("Reservation created successfully with code: {}", reservation.getReservationCode());

            return convertToResponse(reservation);

        } catch (OptimisticLockingFailureException e) {
            logger.error("Concurrency conflict detected when creating reservation", e);
            throw new RuntimeException("Conflit de concurrence détecté. Veuillez réessayer.", e);
        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            throw e;
        }
    }

    private String generateReservationCode() {
        return "RES-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getUserReservations(Long userId) {
        logger.debug("Fetching reservations for user ID: {}", userId);
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ReservationResponse> getUserReservationsByEmail(String email) {
        logger.debug("Fetching reservations for user email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
                
        return reservationRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationByCode(String reservationCode) {
        logger.debug("Fetching reservation by code: {}", reservationCode);
        Reservation reservation = reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));
        return convertToResponse(reservation);
    }

    @Transactional
    public void cancelReservation(String reservationCode, String userEmail) {
        logger.info("Cancelling reservation with code: {} for user: {}", reservationCode, userEmail);
        Reservation reservation = reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));
                
        // Check if the reservation belongs to the authenticated user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
                
        if (!reservation.getUser().getId().equals(user.getId())) {
            logger.warn("User {} attempted to cancel reservation {} belonging to user {}", 
                       userEmail, reservationCode, reservation.getUser().getId());
            throw new AccessDeniedException("Vous n'êtes pas autorisé à annuler cette réservation");
        }

        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            logger.warn("Attempted to cancel already cancelled reservation: {}", reservationCode);
            throw new IllegalStateException("La réservation est déjà annulée");
        }

        // Libération des places
        Event event = eventRepository.findByIdWithLock(reservation.getEvent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Événement non trouvé"));
        
        event.releaseSeats(reservation.getNumberOfSeats());
        eventRepository.save(event);
        logger.debug("Released {} seats for event {}, now available: {}", 
                    reservation.getNumberOfSeats(), event.getId(), event.getAvailableSeats());

        // Mise à jour du statut de la réservation
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        logger.info("Reservation {} successfully cancelled", reservationCode);
    }

    private ReservationResponse convertToResponse(Reservation reservation) {
        return ReservationResponse.builder()
            .id(reservation.getId())
            .reservationCode(reservation.getReservationCode())
            .userName(reservation.getUser().getFullName())
            .eventName(reservation.getEvent().getName())
            .event(convertEventToResponse(reservation.getEvent()))
            .numberOfSeats(reservation.getNumberOfSeats())
            .totalPrice(reservation.getTotalPrice())
            .status(reservation.getStatus().toString())
            .reservationDate(reservation.getReservationDate())
            .build();
    }
    
    private EventResponse convertEventToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .price(event.getPrice())
                .category(event.getCategory())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
