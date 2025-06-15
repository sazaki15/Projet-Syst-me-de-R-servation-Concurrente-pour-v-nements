package com.reservation.controller;

import com.reservation.dto.AuthRequest;
import com.reservation.dto.AuthResponse;
import com.reservation.dto.RegisterRequest;
import com.reservation.model.User;
import com.reservation.security.JwtUtil;
import com.reservation.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Invalid credentials"));
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        User user = authService.getUserByEmail(request.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getId(),
                null
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getFullName(),
                    user.getId(),
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }
} 