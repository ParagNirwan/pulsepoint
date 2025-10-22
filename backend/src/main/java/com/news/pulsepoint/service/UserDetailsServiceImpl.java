package com.news.pulsepoint.service;

import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        User user = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)
        );

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword()) // must be BCrypt encoded
                .authorities(new ArrayList<>()) // empty list if you don't use roles yet
                .build();
    }
}
