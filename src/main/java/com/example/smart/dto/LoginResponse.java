package com.example.smart.dto;

public class LoginResponse {

    private String token; // JWT 토큰
    private String userId;
    private String role; // 핵심: ADMIN 또는 USER
}
