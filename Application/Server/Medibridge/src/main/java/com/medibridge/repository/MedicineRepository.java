package com.medibridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>{
     List<Medicine> findByDonarId(Long id);
	boolean existsBymedicineName(String medicineName);
}
