package com.example.smart.security;

import com.example.smart.entity.User;
import com.example.smart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security가 사용자 인증 정보를 로드하기 위해 사용하는 핵심 서비스.
 * 토큰 인증 시 userId를 기반으로 DB에서 사용자 정보를 가져옵니다.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 사용자 ID(Username)를 기반으로 사용자 정보를 로드합니다.
     * JwtTokenProvider에서 이 메서드를 호출합니다.
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        // [주의] UserRepository에 findByUserId(String userId)가 정의되어 있어야 합니다.
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        // User 엔티티를 CustomUserDetails 객체로 변환하여 반환
        return new CustomUserDetails(user);
    }
}