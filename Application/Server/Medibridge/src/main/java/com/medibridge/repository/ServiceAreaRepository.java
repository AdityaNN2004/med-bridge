package com.medibridge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.ngo.ServiceArea;

public interface ServiceAreaRepository extends JpaRepository<ServiceArea, Long> {

}