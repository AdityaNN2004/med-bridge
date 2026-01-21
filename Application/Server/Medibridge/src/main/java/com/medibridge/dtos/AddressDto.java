package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AddressDto {

    private Long addressId;

    private String fullAddress;

    private String city;

    private String state;

    private int pincode;

    private boolean isActive;

    private Long donarId;
}
