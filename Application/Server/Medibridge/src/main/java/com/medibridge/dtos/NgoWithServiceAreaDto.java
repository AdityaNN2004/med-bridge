package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NgoWithServiceAreaDto {

    private Long ngoId;
    private String organizationName;
    private String registrationNumber;

    // Service Area fields
    private String companyName;
    private String streetAddress;
    private String landMark;
    private String city;
    private String district;
    private String state;
    private String zipCode;
    private String primaryContact;
    private int serviceRadius;
}
