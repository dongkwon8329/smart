package com.example.smart.dto;

import com.example.smart.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date; // Date 타입 import

@Getter
@Builder
public class UserResponse {
    private String userId;
    private String name;
    private BigDecimal income;
    private String role; // 사용자 권한/등급
    private LocalDateTime createdAt; // 회원 가입일

    // User 엔티티를 UserResponse DTO로 변환하는 정적 메서드
    public static UserResponse from(User user) {
        // [주의] User 모델에 getRole()과 getCreatedAt()이 존재해야 합니다.
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .income(user.getIncome())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}