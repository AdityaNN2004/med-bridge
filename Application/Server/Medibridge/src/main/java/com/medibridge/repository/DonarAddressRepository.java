package com.medibridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Medicine;

@Repository
public interface DonarAddressRepository extends JpaRepository<Address, Long> {
	 List<Address> findByDonarId(Long donarId);
}
