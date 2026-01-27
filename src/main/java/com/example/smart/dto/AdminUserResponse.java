// src/main/java/com/example/smart/dto/AdminUserResponse.java

package com.example.smart.dto;

import com.example.smart.entity.User;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class AdminUserResponse {
    private final String userId;
    private final String name;
    private final Integer age;
    private final String role;
    private final LocalDateTime createdAt;
    // 비밀번호, 소득 등 민감 정보는 제외하고 필요 시 별도 API로 처리

    public AdminUserResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.age = user.getAge();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
    }
}
