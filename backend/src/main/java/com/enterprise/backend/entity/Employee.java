package com.enterprise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

private String employeeCode;

private String firstName;

private String lastName;

private String email;

private String phone;

private String gender;

private String designation;

private Double salary;

private String department;

private String employmentType;

private Boolean active;
}