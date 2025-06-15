package com.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'événement est obligatoire")
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "La date de l'événement est obligatoire")
    @Column(nullable = false)
    private LocalDateTime eventDate;

    @NotNull(message = "Le nombre total de places est obligatoire")
    @Min(value = 1, message = "Le nombre de places doit être supérieur à 0")
    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Integer availableSeats;

    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix doit être positif")
    @Column(nullable = false)
    private Double price;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE) // Prevent direct setting of createdAt
    private LocalDateTime createdAt;

    @Version
    private Long version; // Pour le verrouillage optimiste

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Méthodes utilitaires
    public boolean hasAvailableSeats(int requestedSeats) {
        return availableSeats >= requestedSeats;
    }

    public void reserveSeats(int seats) {
        if (!hasAvailableSeats(seats)) {
            throw new IllegalStateException("Pas assez de places disponibles");
        }
        this.availableSeats -= seats;
    }

    public void releaseSeats(int seats) {
        this.availableSeats = Math.min(totalSeats, availableSeats + seats);
    }
}
