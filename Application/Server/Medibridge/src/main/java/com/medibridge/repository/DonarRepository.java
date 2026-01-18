package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.Medicine;

@Repository
public interface DonarRepository extends JpaRepository<Donar, Long> {
   boolean existsByUser_Id(Long userId);
   Optional<Donar> findByUser_Id(Long userId);
   
}
