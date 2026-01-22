package com.medibridge.dtos;



import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViewStatusDtoDonarId {

//	@NotNull(message = "NGO ID is required")
	private Long ngoId;
	
	//@NotNull(message = "Medicine ID is required")
	private Long medicineId;
	
}
