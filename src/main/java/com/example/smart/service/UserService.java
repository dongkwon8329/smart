package com.example.smart.service;

import com.example.smart.dto.UserSignUpRequest;
import com.example.smart.dto.UserLoginRequest;
import com.example.smart.entity.User;
import com.example.smart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 💡 회원가입 로직
    @Transactional
    public void signUp(UserSignUpRequest request) {

        // 1. 아이디 중복 체크
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 아이디(ID)입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. DTO → Entity 변환
        User newUser = new User();
        newUser.setUserId(request.getUserId());
        newUser.setName(request.getName());
        newUser.setPassword(encodedPassword);
        newUser.setAge(request.getAge());

        // Double → BigDecimal 변환 (null 체크 포함)
        if (request.getIncome() != null) {
            newUser.setIncome(BigDecimal.valueOf(request.getIncome()));
        }
        if (request.getGoalAmount() != null) {
            newUser.setGoalAmount(BigDecimal.valueOf(request.getGoalAmount()));
        }

        // 4. 저장
        userRepository.save(newUser);
    }

    // 💡 로그인 로직
    @Transactional(readOnly = true)
    public User login(UserLoginRequest request) {

        System.out.println("로그인 시도: userId=" + request.getUserId() + ", password=" + request.getPassword());



        // 1. 사용자 조회
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 아이디(ID)를 찾을 수 없습니다."));

        System.out.println("입력된 비밀번호(원본): " + request.getPassword());
        System.out.println("DB 저장된 비밀번호(암호화): " + user.getPassword());
        System.out.println("matches 결과: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 시 사용자 반환
        return user;
    }
}
