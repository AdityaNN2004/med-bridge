package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DonarRegistrationDto {

    private UserDto user;
    private AddressDto address;
}
