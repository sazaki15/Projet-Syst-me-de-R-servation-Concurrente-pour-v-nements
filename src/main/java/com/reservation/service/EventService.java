package com.reservation.service;

import com.reservation.dto.EventRequest;
import com.reservation.dto.EventResponse;
import com.reservation.exception.ResourceNotFoundException;
import com.reservation.model.Event;
import com.reservation.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Event event = Event.builder()
            .name(request.getName())
            .description(request.getDescription())
            .eventDate(request.getEventDate())
            .totalSeats(request.getTotalSeats())
            .availableSeats(request.getTotalSeats())
            .price(request.getPrice())
            .category(request.getCategory())
            .imageUrl(request.getImageUrl())
            .build();
        
        event = eventRepository.save(event);
        return convertToResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findUpcomingEventsWithAvailableSeats(LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement non trouvé"));
        return convertToResponse(event);
    }

    private EventResponse convertToResponse(Event event) {
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
