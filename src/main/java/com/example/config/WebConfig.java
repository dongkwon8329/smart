package com.example.config; // ⬅️ 본인의 패키지 경로에 맞게 수정해주세요.

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 프론트엔드 출처(localhost와 127.0.0.1)를 모두 허용
                .allowedOrigins("http://localhost:5175", "http://127.0.0.1:5175")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // 인증 헤더(Authorization) 및 쿠키 허용
                .maxAge(3600);
    }
}