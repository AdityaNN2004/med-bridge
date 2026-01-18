package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{
   boolean existsByEmail(String email);
   Optional<User> findByEmailAndPassword(String email, String password);
   Optional<User> findByEmail(String email);
}
