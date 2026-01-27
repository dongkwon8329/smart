package com.example.smart.security;

import com.example.smart.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security가 사용자 인증 정보를 보관하는 객체 (UserDetails 인터페이스 구현)
 */
@Getter
public class CustomUserDetails implements UserDetails {

    // 실제 User 엔티티 객체를 포함
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // --- UserDetails 필수 메서드 구현 ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // User 엔티티의 Role 필드(예: "USER", "ADMIN")를 Spring Security 권한 객체로 변환
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    @Override
    public String getPassword() {
        // 실제 비밀번호 필드를 반환 (비교용이 아니라 Spring Security 저장용)
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // 사용자 ID를 Username으로 사용
        return user.getUserId();
    }

    // 모든 만료/잠금 필드는 true로 설정 (간단한 구현)
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}