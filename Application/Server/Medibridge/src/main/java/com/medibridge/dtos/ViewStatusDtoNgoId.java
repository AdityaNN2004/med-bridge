package com.medibridge.dtos;



import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViewStatusDtoNgoId {

//	@NotNull(message = "NGO ID is required")
	private Long donarId;
	
	//@NotNull(message = "Medicine ID is required")
	private Long medicineId;
	
}
