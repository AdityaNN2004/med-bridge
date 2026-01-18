package com.medibridge.global_exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.medibridge.custom_exceptions.AuthenticationException;
import com.medibridge.custom_exceptions.ResourceNotFoundException;
import com.medibridge.dtos.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
   @ExceptionHandler(ResourceNotFoundException.class)
   public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e)
   {
	   return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(e.getMessage(), "Failed !!!"));
   }
   @ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<?> handleAuthenticationException(AuthenticationException e)

	{
		System.out.println("in auth exc .....");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage(), "Failed"));
	}
}
