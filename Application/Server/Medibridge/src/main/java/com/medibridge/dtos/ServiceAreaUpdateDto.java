package com.medibridge.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceAreaUpdateDto {

	private String companyName;
    private String streetAddress;
    private String landMark;
    private String city;
    private String district;
    private String zipCode;
    private String state;
    private String primaryContact;
 
}