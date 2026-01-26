package com.medibridge.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.medibridge.entities.donar.MedicineCategory;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ListedMedicineInAreaDto {
	private Long id;
	private LocalDateTime lastUpdated;
    private String medicineName;
    private LocalDate expiry_date;
    private String quantity;
    private byte[] medicineImage;
    private MedicineCategory medicinecategory;
    private Long donarid;
    private Double distancefromdonar;
}
