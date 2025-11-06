package com.example.smart.repository;

import com.example.smart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // 로그인 시 사용자 이름(name)으로 User 엔티티를 조회하는 메서드
    Optional<User> findByUserId(String userId);

    // 회원가입 시 이름 중복 체크를 위한 메서드
    boolean existsByUserId(String userId);
}