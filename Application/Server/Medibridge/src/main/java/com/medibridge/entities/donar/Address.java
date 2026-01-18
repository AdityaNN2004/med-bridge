package com.medibridge.entities.donar;

import java.util.ArrayList;
import java.util.List;

import com.medibridge.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "address")
@AttributeOverride(name="id", column =@Column(name="address_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "donar")
public class Address extends BaseEntity{
	
	@Column(name = "full_address" ,length = 400)
    private String fullAddress;
	@Column(length = 50)
    private String city;
	@Column(length = 50)
    private String state;
	@Column(length = 50)
    private int pincode;
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name= "donar_id",nullable = false)
	private Donar donar;
    public Address(String fullAddress, String city, String state, int pincode) {
		super();
		this.fullAddress = fullAddress;
		this.city = city;
		this.state = state;
		this.pincode = pincode;
	}
}
