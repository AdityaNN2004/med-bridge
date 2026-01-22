package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.ngo.ViewStatusNgo;

public interface ViewStatusNgoRepository
        extends JpaRepository<ViewStatusNgo, Long> {

    Optional<ViewStatusNgo>
    findByMedicineIdAndNgoId(Long medicineId, Long ngoId);

   
    boolean existsByMedicineIdAndNgoId(Long medicineId, Long ngoId);
}
