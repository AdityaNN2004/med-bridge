package com.medibridge.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class NgoDetailsDto {

	private String organizationName;
    private String registrationNumber;
    private String city;
    private String companyName;
    private String district;
    private String primaryContact;
    private Integer serviceRadius;
    private String state;
    private String streetAddress;
    private String zipCode;
}