package com.medibridge.entities;
import java.time.*;
import jakarta.persistence.*;
import org.hibernate.annotations.*;
import lombok.*;
@Getter
@Setter
@ToString
@MappedSuperclass
public abstract class BaseEntity {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id ;
 @CreationTimestamp
 @Column(name="created_on")
 private LocalDate createdOn;
 @UpdateTimestamp
 @Column(name="last_updated")
 private LocalDateTime lastUpdated;
}
