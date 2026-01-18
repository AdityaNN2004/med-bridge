package com.medibridge.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
	private LocalDateTime timeStamp;
	private String message;
	private String status;

	public ApiResponse(String message, String status) {
		super();
		this.message = message;
		this.status = status;
		this.timeStamp = LocalDateTime.now();
	}
}
