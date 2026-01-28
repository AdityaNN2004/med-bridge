package com.medibridge.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {

    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String password;
    private String userRole;
}
