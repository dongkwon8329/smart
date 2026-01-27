package com.example.smart.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Base64;
// 💡 [추가된 기능]을 위해 필요한 import
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    // 🔑 토큰 서명에 사용될 비밀 키 (application.properties 등에서 주입받음)
    private final Key key;

    // ⏱️ 토큰 만료 시간 (예: 30분)
    private final long tokenValidityInMilliseconds;

    // 💡 [추가] CustomUserDetailsService를 주입받기 위한 필드
    private final UserDetailsService userDetailsService;

    // 💡 [수정] 생성자에 tokenValidityInSeconds와 UserDetailsService 주입 추가
    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey,
                            @Value("${jwt.token-validity-in-seconds}") long tokenValidityInSeconds,
                            UserDetailsService userDetailsService) {
        // HMAC SHA-256 알고리즘 사용을 위한 키 생성
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.tokenValidityInMilliseconds = tokenValidityInSeconds * 1000; // 초 -> 밀리초
        this.userDetailsService = userDetailsService; // 주입된 서비스 저장
    }

    /**
     * JWT 토큰을 생성합니다. (UserId를 subject로 사용)
     */
    public String createToken(String userId) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + this.tokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(userId) // 토큰의 제목 (payload: userId)
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(validity) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 서명 (비밀키와 알고리즘)
                .compact();
    }

    /**
     * 토큰에서 사용자 ID (subject)를 추출합니다.
     */
    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 💡 [추가] 토큰 유효성 검증 메서드
    /**
     * JWT 토큰의 유효성 (만료 및 서명)을 검증합니다.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            logger.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            logger.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            logger.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            logger.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    // 💡 [추가] 토큰으로 Authentication 객체를 생성하는 메서드
    /**
     * JWT 토큰을 사용하여 Authentication 객체를 생성합니다. (JwtAuthenticationFilter에서 호출됨)
     */
    public Authentication getAuthentication(String token) {
        // 토큰에서 사용자 ID 추출
        String userId = this.getUserIdFromToken(token);

        // CustomUserDetailsService를 통해 사용자 정보를 로드
        UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

        // Spring Security의 인증 객체(Authentication) 반환
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}