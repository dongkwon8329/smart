package com.example.smart.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    // 일반 사용자 정보 수정 필드
    private String name;
    private String phoneNumber;
    private BigDecimal income;
    private Integer age; // 🔑 나이 필드 추가 (AdminMainPage에서 사용됨)

    // 🔑 [핵심 추가] 관리자가 사용자의 권한(ROLE)을 수정할 수 있도록 필드 추가
    private String role;

    // private String profileImageUrl; // 필요하다면 이 필드도 추가
}