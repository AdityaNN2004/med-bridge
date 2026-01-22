package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MedicineCategoryPercentageDto {

    private String medicineCategory;
    private Double percentage;
}
