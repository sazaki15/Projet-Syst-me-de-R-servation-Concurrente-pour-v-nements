package com.reservation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequest {
    @NotBlank(message = "Le nom de l'événement est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "La date de l'événement est obligatoire")
    private LocalDateTime eventDate;

    @NotNull(message = "Le nombre total de places est obligatoire")
    @Min(value = 1, message = "Le nombre de places doit être supérieur à 0")
    private Integer totalSeats;

    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix doit être positif")
    private Double price;
    
    private String category;
    
    private String imageUrl;
}
