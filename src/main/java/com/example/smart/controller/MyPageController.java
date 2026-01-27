package com.example.smart.controller;

import org.springframework.http.ResponseEntity; // 이 부분이 누락되었을 가능성이 높습니다.
import org.springframework.security.core.Authentication; // 이 부분도 누락되었을 수 있습니다.
import org.springframework.web.bind.annotation.GetMapping;
import com.example.smart.dto.UserResponse;
import com.example.smart.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("")
    public ResponseEntity<UserResponse> getMyInfo(Authentication authentication) {
        // 🔑 Spring Security를 통해 현재 로그인된 사용자 ID를 가져옵니다.
        String userId = authentication.getName();

        UserResponse userInfo = myPageService.getUserInfo(userId);

        return ResponseEntity.ok(userInfo);
    }
}
