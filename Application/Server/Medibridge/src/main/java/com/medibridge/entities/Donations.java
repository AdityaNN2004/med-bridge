package com.medibridge.entities;

import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.Ngo;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "donations")
@AttributeOverride(name="id", column =@Column(name="donation_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Donations extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "donar_id", nullable = false)
    private Donar donar;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;
    
    @Enumerated(EnumType.STRING)
    private DonationStatusDon donationstatus = DonationStatusDon.Pending;
}
