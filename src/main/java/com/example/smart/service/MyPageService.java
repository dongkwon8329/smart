
package com.example.smart.service;

import com.example.smart.dto.UserResponse;
import com.example.smart.entity.User;
import com.example.smart.repository.MyPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
// ... (생략)

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MyPageRepository myPageRepository;

    public UserResponse getUserInfo(String userId) {
        // Repository를 통해 User를 찾고, 없으면 예외 발생
        User user = myPageRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        // Entity를 DTO로 변환하여 반환
        return UserResponse.from(user);
    }
}
