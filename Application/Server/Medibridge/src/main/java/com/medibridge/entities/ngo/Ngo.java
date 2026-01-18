package com.medibridge.entities.ngo;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.User;
import com.medibridge.entities.ngo.ServiceArea;
@Entity
@Table(name="ngo")
@AttributeOverride(name ="id", column=@Column(name ="ngo_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"confirmPassword"})
public class Ngo extends BaseEntity {
  @Column(name ="organization_name",length= 50)
  private String organizationName;
  @Column(name ="registration_number",length= 50)
  private String registrationNumber;
  private byte[] organizatioInfo;
  @Transient
  private String ConfirmPassword;
  @OneToOne
  @JoinColumn(name="user_id")
  private User user;
  
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "service_area_id")
  private ServiceArea serviceArea;
  
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name="document_registration_id")
  private DocumentRegistration documentRegistration;

   public Ngo(String organizationName, String registrationNumber, byte[] organizatioInfo, String confirmPassword,
		User user, ServiceArea serviceArea, DocumentRegistration documentRegistration) {
	super();
	this.organizationName = organizationName;
	this.registrationNumber = registrationNumber;
	this.organizatioInfo = organizatioInfo;
	ConfirmPassword = confirmPassword;
	this.user = user;
	this.serviceArea = serviceArea;
	this.documentRegistration = documentRegistration;
   }
  

 
  
}
