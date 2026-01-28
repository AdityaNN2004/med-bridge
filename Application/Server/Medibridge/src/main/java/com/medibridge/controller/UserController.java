package com.medibridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.medibridge.dtos.AuthRequest;
import com.medibridge.dtos.AuthResponse;
import com.medibridge.entities.User;
import com.medibridge.repository.DonarRepository;
import com.medibridge.repository.NgoRepository;
import com.medibridge.security.JwtUtils;
import com.medibridge.service.UserService;

import jakarta.validation.Valid;


@RestController // to declare a spring bean - containing REST API end point provider
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173") // to set CORS policy on specific origins
@Validated
@Slf4j
@RequiredArgsConstructor
public class UserController {
  @Autowired 
  private UserService userService;
  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;
  private final DonarRepository donarRepository;  // ADD THIS
  private final NgoRepository ngoRepository;    
  
  @PostMapping("/sign-in")
  public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest dto)
  {
      System.out.println("in sign in -" + dto);
      
      Authentication fullyAuthenticated = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
      );
      
      System.out.println("is user authenticated " + fullyAuthenticated.isAuthenticated());
      System.out.println(fullyAuthenticated.getPrincipal().getClass());
      
      User user = (User) fullyAuthenticated.getPrincipal();
      
      // Fetch entity_id based on role
      Long entityId = null;
      String role = user.getUserRole().name();
      if ("ROLE_DONAR".equals(role)) {
          entityId = donarRepository.findByUser(user)
              .orElseThrow(() -> new RuntimeException("Donar not found"))
              .getId();
      } else if ("ROLE_NGO".equals(role)) {
          entityId = ngoRepository.findByUser(user)
              .orElseThrow(() -> new RuntimeException("NGO not found"))
              .getId();
      }
      
      return ResponseEntity.ok(
          new AuthResponse("Login Successful", jwtUtils.generateToken(user, entityId))
      );
  }
  
}