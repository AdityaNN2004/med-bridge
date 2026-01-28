package com.medibridge.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.medibridge.entities.User;
import com.medibridge.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j

public class CustomUserDetailsServiceImpl implements UserDetailsService{
    private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		log.info("********  load user by username *********");
		User user = userRepository.findByEmail(email)
	    .orElseThrow(() -> new UsernameNotFoundException("Email doesn't exist"));	
		return user;
	}
    
}
