package com.medibridge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.donar.Donar;

public interface NgoRepository extends JpaRepository<Donar, Long> {

}
