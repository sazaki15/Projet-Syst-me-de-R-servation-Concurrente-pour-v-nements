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
public class ReservationResponse {
    private Long id;
    private String reservationCode;
    private String userName;
    private String eventName;
    private EventResponse event;
    private Integer numberOfSeats;
    private Double totalPrice;
    private String status;
    private LocalDateTime reservationDate;
}
