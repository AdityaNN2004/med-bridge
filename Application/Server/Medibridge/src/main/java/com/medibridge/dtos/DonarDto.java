package com.medibridge.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonarDto {
	private LocalDate createdOn;
	private LocalDateTime lastUpdated;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
}
