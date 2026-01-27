// UserRepository.java (이미 존재할 가능성이 높습니다.)
package com.example.smart.repository;

import com.example.smart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// User 엔티티와 그 기본 키 타입(String)을 명시합니다.
public interface MyPageRepository extends JpaRepository<User, String> {

    // userId(로그인 ID)로 User 엔티티를 조회하는 메서드
    // Optional을 사용하여 결과가 없을 경우를 안전하게 처리합니다.
     Optional<User> findByUserId(String userId);
}