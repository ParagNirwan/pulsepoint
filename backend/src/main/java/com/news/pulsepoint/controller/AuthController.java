package com.news.pulsepoint.controller;

import com.news.pulsepoint.dto.AuthenticationRequest;
import com.news.pulsepoint.dto.AuthenticationResponse;
import com.news.pulsepoint.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import com.news.pulsepoint.service.UserDetailsServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        System.out.println("Attempting login for: " + request.getEmail());
        System.out.println("Password sent: " + request.getPassword());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            e.printStackTrace(); // or log.error("Auth failed", e);
            throw e; // keep throwing so your frontend sees failure
        }

        // 2. Load user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // 3. Generate JWT token
        final String jwt = jwtService.generateToken(userDetails.getUsername());

        // 4. Return response
        return new AuthenticationResponse(jwt, userDetails.getUsername());
    }
}
