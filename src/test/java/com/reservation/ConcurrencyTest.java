package com.reservation;

import com.reservation.dto.ReservationRequest;
import com.reservation.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootTest
@ActiveProfiles("test")
public class ConcurrencyTest {

    @Autowired
    private ReservationService reservationService;

    @Test
    public void testConcurrentReservations() throws InterruptedException {
        int numberOfThreads = 10;
        int seatsPerReservation = 2;
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        
        AtomicInteger successfulReservations = new AtomicInteger(0);
        AtomicInteger failedReservations = new AtomicInteger(0);

        // Simulation de réservations concurrentes
        for (int i = 0; i < numberOfThreads; i++) {
            final int userId = (i % 5) + 1; // Utilise les utilisateurs 1 à 5
            executor.submit(() -> {
                try {
                    ReservationRequest request = new ReservationRequest();
                    request.setUserId((long) userId);
                    request.setEventId(1L); // Concert Rock Festival
                    request.setNumberOfSeats(seatsPerReservation);
                    
                    reservationService.createReservation(request);
                    successfulReservations.incrementAndGet();
                    System.out.println("Réservation réussie pour l'utilisateur " + userId);
                    
                } catch (Exception e) {
                    failedReservations.incrementAndGet();
                    System.out.println("Réservation échouée pour l'utilisateur " + userId + ": " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();

        System.out.println("=== RÉSULTATS DU TEST DE CONCURRENCE ===");
        System.out.println("Réservations réussies: " + successfulReservations.get());
        System.out.println("Réservations échouées: " + failedReservations.get());
        System.out.println("Total des tentatives: " + numberOfThreads);
    }
}
