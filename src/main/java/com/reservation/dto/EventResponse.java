package com.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime eventDate;
    private Integer totalSeats;
    private Integer availableSeats;
    private Double price;
    private String category;
    private String imageUrl;
    private LocalDateTime createdAt;
}
