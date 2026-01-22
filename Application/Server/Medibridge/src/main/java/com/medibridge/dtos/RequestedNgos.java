package com.medibridge.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RequestedNgos {
    private Long ngo_id;
	private String organizationName;
	private Long serviceRadius;
	
}