package com.medibridge.dtos;

import java.time.LocalDate;
import com.medibridge.entities.donar.MedicineCategory;

import java.time.*;
import java.util.List;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import org.hibernate.annotations.*;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class MedicineDto {

	private Long id;
    private String medicineName;
    private LocalDate expiry_date;
    private String quantity;
    private byte[] medicineImage;
    private MedicineCategory medicinecategory;
    private Long donarid;
    // getters and setters
}
