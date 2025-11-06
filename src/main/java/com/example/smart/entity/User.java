package com.example.smart.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "USERS") // Oracle DB의 테이블 이름
@Getter
@Setter
public class User {

    // DB의 user_id (NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY)
    @Id
    @Column(name = "USER_ID", length = 50)
    private String userId;

    @Column(nullable = false, length = 255)
    private String password; // 암호화된 비밀번호 저장

    @Column(nullable = false, length = 50, unique = true) // name을 고유 식별자로 사용
    private String name;

    @Column(precision = 3)
    private Integer age;

    // 금액 관련 필드는 BigDecimal 사용 (precision, scale 지정 가능)
    @Column(precision = 12, scale = 2)
    private BigDecimal income;

    @Column(name = "GOAL_AMOUNT", precision = 12, scale = 2)
    private BigDecimal goalAmount;

    @Column(nullable = false, length = 10, columnDefinition = "VARCHAR2(10) DEFAULT 'USER'")
    private String role = "USER";

    @Column(name = "CREATED_AT", columnDefinition = "DATE DEFAULT SYSDATE")
    private LocalDateTime createdAt = LocalDateTime.now();
}
