package com.example.smart.controller;
// src/main/java/com/app/controller/UserController.java
import com.example.smart.dto.UserSignUpRequest;
import com.example.smart.dto.UserLoginRequest;
import com.example.smart.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5175", methods = {RequestMethod.POST})

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 💡 POST /api/users/signup
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserSignUpRequest request) {

        System.out.println("📩 회원가입 요청 들어옴: " + request);


        try {

            userService.signUp(request);
            // HTTP 201 Created 반환
            return new ResponseEntity<>("회원가입 성공", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {

            // 이름 중복 등의 비즈니스 로직 오류 (HTTP 400 Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 💡 POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        try {
            userService.login(request); // 인증 로직 실행

            // 실제 서비스에서는 로그인 성공 시 JWT 토큰을 생성하여 반환합니다.
            // 여기서는 단순 성공 메시지를 반환합니다.
            return ResponseEntity.ok("로그인 성공");
        } catch (IllegalArgumentException e) {
            // 인증 실패 오류 (HTTP 401 Unauthorized 또는 400 Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

}