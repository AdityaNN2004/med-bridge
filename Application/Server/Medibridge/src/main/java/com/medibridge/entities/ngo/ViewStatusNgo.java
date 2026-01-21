package com.medibridge.entities.ngo;

import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.User;
import com.medibridge.entities.donar.Medicine;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Entity
@Table(name = "viewstatus_ngo")
@AttributeOverride(name="id", column =@Column(name="viewstatus_ngo_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ViewStatusNgo extends BaseEntity {
	
	@OneToOne
	@JoinColumn(name = "medicine_id")
	private Medicine medicine;
	
	@ManyToOne
	@JoinColumn(name = "ngo_id")
	private Ngo ngo;
	
	private DonarApproval donarapproval =  DonarApproval.Donar_NotApproved;
	
	private DonationStatusNgo donationStatusNgo = DonationStatusNgo.DonationProcessNotStarted;
}
