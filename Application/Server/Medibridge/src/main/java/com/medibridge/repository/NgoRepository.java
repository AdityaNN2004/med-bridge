package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Address;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;



@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    Optional<Ngo> findByUser_Id(Long userId);
    boolean existsByUser_Email(String email);
    
    @Query("SELECT n.serviceArea FROM Ngo n WHERE n.id = :ngoId")
    ServiceArea findServiceAreaByNgoId(@Param("ngoId") Long ngoId);

}

