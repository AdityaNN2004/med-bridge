package com.medibridge.entities;

import java.time.*;
import java.util.Collection;
import java.util.List;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import org.hibernate.annotations.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.*;

@Entity
@Table(name = "users")
@AttributeOverride(name="id", column =@Column(name="user_id"))
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity  implements UserDetails{
  @Column(length = 400, nullable = false)
  private String email;
  @Column(length = 400)
  private String password;
  @Column(name = "user_role")
  @Enumerated(EnumType.STRING)
  private userRole userRole;
  @Column(length = 15)
  private String mobile;
  @Column(name="is_active",nullable=false)
  private boolean isActive = true;
  
  public User(String email, String password, com.medibridge.entities.userRole userRole, String mobile) {
	super();
	this.email = email;
	this.password = password;
	this.userRole = userRole;
	this.mobile = mobile;
}


@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
  return List.of(new SimpleGrantedAuthority(this.userRole.name()));
}


@Override
public String getUsername() {
	return this.email;
}
  
}
