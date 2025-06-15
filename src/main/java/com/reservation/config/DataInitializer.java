package com.reservation.config;

import com.reservation.model.Event;
import com.reservation.model.User;
import com.reservation.repository.EventRepository;
import com.reservation.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Create test users if not exists
        if (userRepository.count() == 0) {
            createTestUsers();
        }
        
        // Create test events if not exists
        if (eventRepository.count() == 0) {
            createTestEvents();
        }
    }

    private void createTestUsers() {
        System.out.println("Creating test users...");
        
        // Create regular user
        User user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("user@example.com")
                .password(passwordEncoder.encode("password"))
                .roles(new HashSet<>(Collections.singletonList("USER")))
                .build();
        userRepository.save(user);
        
        // Create admin user
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .password(passwordEncoder.encode("admin123"))
                .roles(new HashSet<>(Collections.singletonList("ADMIN")))
                .build();
        userRepository.save(admin);
        
        System.out.println("Test users created successfully!");
    }
    
    private void createTestEvents() {
        System.out.println("Creating test events...");
        
        // Create several events with realistic data
        createEvent(
            "Summer Music Festival", 
            "Join us for an unforgettable music experience with top artists from around the world.", 
            LocalDateTime.now().plusMonths(2), 
            1000, 
            99.99, 
            "Concert",
            "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"
        );
        
        createEvent(
            "Tech Innovation Summit", 
            "The latest innovations and future trends in technology. Featuring keynote speakers from leading tech companies.", 
            LocalDateTime.now().plusMonths(1), 
            500, 
            149.99, 
            "Conference",
            "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
        );
        
        createEvent(
            "Comedy Night Special", 
            "An evening of laughter with the funniest comedians. Join us for a night of comedy and entertainment.", 
            LocalDateTime.now().plusDays(15), 
            200, 
            49.99, 
            "Theater",
            "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg"
        );
        
        createEvent(
            "Digital Marketing Workshop", 
            "Learn the latest digital marketing strategies from industry experts. Hands-on training included.", 
            LocalDateTime.now().plusDays(20), 
            50, 
            149.99, 
            "Workshop",
            "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
        );
        
        createEvent(
            "Basketball Championship Finals", 
            "The most anticipated basketball game of the year. Watch the top teams compete for the championship title.", 
            LocalDateTime.now().plusDays(10), 
            350, 
            299.99, 
            "Sports",
            "https://images.pexels.com/photos/3648360/pexels-photo-3648360.jpeg"
        );
        
        createEvent(
            "Broadway Show: The Phantom", 
            "Experience the magic of Broadway with this classic musical performance. Unforgettable songs and performances.", 
            LocalDateTime.now().plusDays(25), 
            150, 
            199.99, 
            "Theater",
            "https://images.pexels.com/photos/11627592/pexels-photo-11627592.jpeg"
        );
        
        createEvent(
            "Jazz Night at Blue Club", 
            "A night of smooth jazz with renowned musicians. Dinner and drinks available for purchase.", 
            LocalDateTime.now().plusDays(5), 
            80, 
            39.99, 
            "Concert",
            "https://images.pexels.com/photos/4406335/pexels-photo-4406335.jpeg"
        );
        
        createEvent(
            "Science and Technology Expo", 
            "Explore the latest scientific discoveries and technological innovations. Interactive exhibits for all ages.", 
            LocalDateTime.now().plusMonths(3), 
            600, 
            29.99, 
            "Expo",
            "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg"
        );
        
        createEvent(
            "Startup Pitch Competition", 
            "Watch innovative startups pitch their ideas to investors. Networking opportunities available.", 
            LocalDateTime.now().plusDays(30), 
            120, 
            15.99, 
            "Business",
            "https://images.pexels.com/photos/4385290/pexels-photo-4385290.jpeg"
        );
        
        System.out.println("Test events created successfully!");
    }
    
    private void createEvent(String name, String description, LocalDateTime eventDate, int totalSeats, double price, String category, String imageUrl) {
        Event event = Event.builder()
                .name(name)
                .description(description)
                .eventDate(eventDate)
                .totalSeats(totalSeats)
                .availableSeats(totalSeats)
                .price(price)
                .category(category)
                .imageUrl(imageUrl)
                .build();
        eventRepository.save(event);
    }
} 