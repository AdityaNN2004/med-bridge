package com.medibridge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.Donations;

@Repository
public interface DonationsRepository extends JpaRepository<Donations, Long> {

boolean existsByMedicineId(Long medicineId);
}

