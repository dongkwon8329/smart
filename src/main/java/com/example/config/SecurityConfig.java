package com.example.config; // ⬅️ 본인의 패키지 경로에 맞게 수정해주세요.

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order; // Order import
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // 명시적으로 WebSecurity 활성화
public class SecurityConfig {

    // 비밀번호 인코더 Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ----------------------------------------------------------------------
    // 1. Public API 전용 필터 체인: /api/users/signup (401 에러 방지 핵심)
    // ----------------------------------------------------------------------
    @Bean
    @Order(0) // ⬅️ 이 필터 체인을 가장 먼저 실행하도록 강제
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                // 이 필터 체인이 처리할 경로를 /api/users/signup만으로 제한
                .securityMatcher("/api/users/signup", "/api/users/login")
                .cors(Customizer.withDefaults())
                // 공통 설정 (API 서버의 표준)
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 권한 설정: 이 필터 체인에 들어온 요청은 무조건 허용
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll() // ⬅️ 중요: 무조건 허용!
                );

        return http.build();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정 적용
                .cors(Customizer.withDefaults())

                // 공통 설정 (API 서버의 표준)
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 권한 설정: Public API는 Order(0)에서 처리했으므로, 나머지는 인증 필요
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().authenticated() // ⬅️ 나머지 모든 요청은 인증 필요
                );

        return http.build();
    }
}