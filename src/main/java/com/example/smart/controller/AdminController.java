// src/main/java/com/example/smart/controller/AdminController.java

package com.example.smart.controller;

import com.example.smart.dto.AdminUserResponse;
import com.example.smart.dto.UserUpdateRequest;
import com.example.smart.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // 권한 확인을 위해 필요
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin") // 관리자 전용 기본 경로
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    // 💡 [회원 목록 조회] GET /api/admin/users
    @GetMapping("/users")
    // **Spring Security를 통해 ROLE_ADMIN 권한만 접근 허용**
    @PreAuthorize("hasRole('ADMIN')") // 이 어노테이션을 사용하려면 SecurityConfig에 @EnableMethodSecurity가 설정되어야 함
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        // UserService의 관리자용 목록 조회 메소드 호출
        List<AdminUserResponse> users = userService.findAllUsersForAdmin();
        return ResponseEntity.ok(users);
    }

    // 💡 [Update] PUT /api/admin/users/{userId}
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        userService.updateUserByAdmin(userId, request);
        return ResponseEntity.ok().build();
    }

    // 💡 [회원 삭제] DELETE /api/admin/users/{userId}
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        // userService.deleteUser(userId); // UserService에 삭제 로직 구현 필요
        return ResponseEntity.noContent().build();
    }
}
