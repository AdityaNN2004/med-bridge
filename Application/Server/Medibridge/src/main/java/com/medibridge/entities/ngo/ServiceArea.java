package com.medibridge.entities.ngo;

import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.ngo.CollectionType;

import lombok.*;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name ="service_area")
@AttributeOverride(name="id", column= @Column(name ="service_area_id"))
@NoArgsConstructor
@Setter
@Getter
@ToString
public class ServiceArea extends BaseEntity{
   @Column(name="company_name", length = 50)
   private String companyName;
   @Column(name="street_address", length = 200)
   private String streetAddress;
   @Column(name="landmark", length = 50)
   private String landMark;
   @Column(name="city", length = 50)
   private String city;
   @Column(name="district", length = 50)
   private String district;
   @Column(name="zipcode", length = 50)
   private String zipCode;
   @Column(name="state", length = 50)
   private String state;
   @Enumerated(EnumType.STRING)
   @Column(name="collection_type")
   private CollectionType collectionType;
   @Column(name="primary_contact", length = 15)
   private String primaryContact;
   @Column(name="service_radius", length = 50)
   private int serviceRadius;
   
   public ServiceArea(String companyName, String streetAddress, String landMark, String city, String district,
		String zipCode, String state, CollectionType collectionType, String primaryContact, int serviceRadius) {
	super();
	this.companyName = companyName;
	this.streetAddress = streetAddress;
	this.landMark = landMark;
	this.city = city;
	this.district = district;
	this.zipCode = zipCode;
	this.state = state;
	this.collectionType = collectionType;
	this.primaryContact = primaryContact;
	this.serviceRadius = serviceRadius;
   }  
   
   
}
