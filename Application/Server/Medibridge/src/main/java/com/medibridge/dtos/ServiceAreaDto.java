package com.medibridge.dtos;

import com.medibridge.entities.ngo.CollectionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ServiceAreaDto {

    private Long serviceAreaId;

    private String companyName;

    private String streetAddress;

    private String landMark;

    private String city;

    private String district;

    private String zipCode;

    private String state;

    private CollectionType collectionType;

    private String primaryContact;

    private int serviceRadius;
}
