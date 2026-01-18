package com.medibridge.dtos;

import org.aspectj.apache.bcel.generic.Type;

import com.medibridge.entities.User;
import com.medibridge.entities.userRole;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter
@AllArgsConstructor
public class AuthResponse {
  private String message;  
  private String jwtString;
}
