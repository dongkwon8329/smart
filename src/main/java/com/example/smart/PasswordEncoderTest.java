// 예시 위치: src/main/java/com/example/smart/PasswordEncoderTest.java

package com.example.smart; // 본인의 기본 패키지 경로에 맞게 수정하세요.

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderTest {
    public static void main(String[] args) {
        // BCryptPasswordEncoder는 Spring Security의 라이브러리입니다.
        // 프로젝트에 'spring-boot-starter-security' 의존성이 추가되어 있어야 합니다.
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String plainPassword = "rlatnals123!"; // 사용할 평문 비밀번호
        String encodedPassword = encoder.encode(plainPassword);

        System.out.println("생성된 해시 값: " + encodedPassword);
    }
}