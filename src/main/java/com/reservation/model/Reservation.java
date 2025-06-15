package com.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'utilisateur est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "L'événement est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @NotNull(message = "Le nombre de places est obligatoire")
    @Min(value = 1, message = "Le nombre de places doit être supérieur à 0")
    @Column(nullable = false)
    private Integer numberOfSeats;

    @NotNull(message = "Le prix total est obligatoire")
    @Column(nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime reservationDate;

    @Column(unique = true, nullable = false)
    private String reservationCode;


    private String generateReservationCode() {
        return "RES-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }

    public enum ReservationStatus {
        CONFIRMED, CANCELLED, PENDING
    }
}
