package com.example.smart.config;

// 💡 [JWT] 필수 추가 (패키지 경로 확인)
import com.example.smart.security.JwtAuthenticationFilter;
import com.example.smart.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    // 비밀번호 인코더 Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ----------------------------------------------------------------------
    // 1. Public API 전용 필터 체인: 로그인/회원가입 및 정적 리소스 허용
    // ----------------------------------------------------------------------
    @Bean
    @Order(0)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                // 공개 경로를 문자열로 명시 (AntPathRequestMatcher 오류 회피)
                .securityMatcher(
                        "/api/users/signup",
                        "/api/users/login",
                        "/favicon.ico",
                        "/manifest.json",
                        "/api/savings/**",
                        "/api/chat/**",
                        "/api/branches/**"
                )
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 권한 설정: 이 필터 체인에 들어온 요청은 무조건 허용
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    // ----------------------------------------------------------------------
    // 2. 보호된 API 전용 필터 체인 (JWT 필터 통합)
    // ----------------------------------------------------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정 적용
                .cors(Customizer.withDefaults())

                // 공통 설정 (API 서버의 표준)
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                // 세션 관리: STATELESS 유지
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 🔑 [추가] JWT 인증 필터 등록 (가장 중요)
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                )

                // 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                        // 🔑 [핵심] 설문조사 API 경로를 인증된 사용자에게 명시적으로 허용
                        .requestMatchers(
                                "/api/survey/**",
                                "/api/mypage/**"
                        ).authenticated() // ⬅️ /api/survey로 시작하는 모든 경로는 인증 필수

                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}