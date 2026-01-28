package com.medibridge.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonationsDto {

    private Long donar_id;
    private Long ngo_id;
    private Long medicine_id;
}
