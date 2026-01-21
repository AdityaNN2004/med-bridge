package com.medibridge.dtos;

import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.Ngo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViewStatusDto {

	private Ngo ngo;
	
	private Medicine medicine;
	
}
