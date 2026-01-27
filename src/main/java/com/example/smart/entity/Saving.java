package com.example.smart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor   // ✅ Hibernate용 기본 생성자
@AllArgsConstructor  // ✅ DTO 변환용 전체 생성자
@Builder             // ✅ 빌더 패턴
@Table(name = "saving") // ✅ 테이블 이름 지정 (선택)
public class Saving {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "SAVING_ID") // ✅ DB 컬럼 이름과 매핑
    private Long id;

    @Column(name = "BANK_NAME")
    private String bankName;

    @Column(name = "PRODUCT_NAME")
    private String productName;

    @Column(name = "INTEREST_RATE")
    private Double interestRate;

    @Column(name = "MAX_INTEREST_RATE")
    private Double maxInterestRate;

    @Column(name = "PERIOD")
    private Integer period;

    @Column(name = "CONDITION")
    private String condition;

    @Column(name = "LINK_URL")
    private String linkUrl;

    @Column(name = "CREATED_AT")
    private java.sql.Date createdAt;

    @Column(name = "UPDATED_AT")
    private java.sql.Date updatedAt;
}

