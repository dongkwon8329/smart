package com.example.smart.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "BANK_BRANCH")
@Getter
@Setter
public class BankBranch {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "branch_seq")
    @SequenceGenerator(name = "branch_seq", sequenceName = "BANK_BRANCH_SEQ", allocationSize = 1)
    @Column(name = "BRANCH_ID")
    private Long branchId;

    @Column(name = "BANK_NAME", nullable = false)
    private String bankName;

    @Column(name = "ADDRESS", nullable = false)
    private String address;

    @Column(name = "LATITUDE")
    private Double latitude;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}
