package com.medibridge.entities.ngo;

import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="document_registration")
@AttributeOverride(name ="id", column=@Column(name ="document_registration_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class DocumentRegistration extends BaseEntity{
 @Column(name="registration_certificate", length = 300)
 private byte[] RegistrationCertificate;
 @Column(name="tax_exemption_certificate", length = 300)
 private byte[] taxExemptionCertificate;
 @Column(name="contact_person_id_proof", length = 300)
 private byte[] contactPersonIdProof;
 
 public DocumentRegistration(byte[] registrationCertificate, byte[] taxExemptionCertificate,byte[] contactPersonIdProof) {
	super();
	RegistrationCertificate = registrationCertificate;
	this.taxExemptionCertificate = taxExemptionCertificate;
	this.contactPersonIdProof = contactPersonIdProof;
}
 
}
