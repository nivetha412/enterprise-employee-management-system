package com.enterprise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees", uniqueConstraints = {
        @UniqueConstraint(columnNames = "employee_code"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", unique = true, nullable = true)
    private String employeeCode;

private String firstName;

private String lastName;

private String email;

@Column(name = "password_hash")
private String passwordHash;

private String phone;

private String gender;

private String designation;

private Double salary;

private String department;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id", foreignKey = @ForeignKey(name = "fk_employee_department"))
private Department departmentEntity;

private String employmentType;

private Boolean active;
}
