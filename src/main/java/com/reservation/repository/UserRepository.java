package com.reservation.repository;

import com.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Adding a method to find user by email with detailed logging
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findDetailedUserByEmail(@Param("email") String email);
}
