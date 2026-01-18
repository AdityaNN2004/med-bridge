package com.medibridge.entities.donar;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.User;
@Entity
@Table(name = "donars")
@AttributeOverride(name="id", column =@Column(name="donar_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Donar extends BaseEntity{
	
	@Column(name ="first_name",length= 50)
    private String firstName;
	@Column(name ="last_name",length= 50)
    private String lastName;
	@Transient
    private String confirmPassword;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="user_id")
	private User user;
	
	public Donar(User user, String firstName, String lastName, String confirmPassword, List<Address> address) {
		this.user = user;
		this.firstName = firstName;
		this.lastName = lastName;
		this.confirmPassword = confirmPassword;
		
	}
//	update profile fields 
//	dob
//	profilePhoto
//	phoneNo
//	govtIdproof
	
	
}
