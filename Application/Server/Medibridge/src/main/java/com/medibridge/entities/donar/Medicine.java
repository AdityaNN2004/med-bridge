package com.medibridge.entities.donar;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

import com.medibridge.entities.BaseEntity;
@Entity
@Table(name = "medicine")
@AttributeOverride(name="id", column =@Column(name="medicine_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Medicine extends BaseEntity {
  @Column(name="medicine_name", length = 60)
  private String medicineName;
  private LocalDate expiry_date;
  @Column(name="quantity", length = 20)
  private String quantity;
  @Lob
  private byte[] medicineImage;
  
  @Enumerated(EnumType.STRING)
  private MedicineCategory medicinecategory;
  
  @Enumerated(EnumType.STRING)
  private ListingStatus listingStatus = ListingStatus.NotListed;
  
  @Enumerated(EnumType.STRING)
  private DonationStatus donationStatus = DonationStatus.NotAccepted;
  
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name= "donar_id",nullable = false)
  private Donar donar;
  
  public Medicine(String medicineName, LocalDate expiry_date, String quantity, byte[] medicineImage,
		MedicineCategory medicinecategory, Donar donar) {
	super();
	this.medicineName = medicineName;
	this.expiry_date = expiry_date;
	this.quantity = quantity;
	this.medicineImage = medicineImage;
	this.medicinecategory = medicinecategory;
	this.donar = donar;
  }
   
}
