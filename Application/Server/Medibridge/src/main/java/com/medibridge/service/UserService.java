package com.medibridge.service;

import org.springframework.stereotype.Service;

import com.medibridge.dtos.AuthRequest;
import com.medibridge.dtos.AuthResponse;
@Service
public interface UserService {
   AuthResponse authenticateUser(AuthRequest dto);
}
