package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorWithAddressDto {

    private Long donarId;
    private String firstName;
    private String lastName;

    private Long addressId;
    private String fullAddress;
    private String city;
    private String state;
    private Integer pincode;
}
