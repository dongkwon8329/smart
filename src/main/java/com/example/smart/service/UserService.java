package com.example.smart.service;

import com.example.smart.dto.AdminUserResponse;
import com.example.smart.dto.UserSignUpRequest;
import com.example.smart.dto.UserLoginRequest;
import com.example.smart.entity.User;
import com.example.smart.repository.SavingRepository;
import com.example.smart.repository.UserRepository;
import com.example.smart.repository.UserSurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.smart.dto.UserUpdateRequest;


import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserSurveyRepository userSurveyRepository;
    private final SavingRepository savingRepository;
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

    // 💡 [추가] 사용자 정보 수정 메서드
    @Transactional
    public void updateUserInfo(String userId, UserUpdateRequest request) {
        // 1. 사용자 엔티티 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        // 2. 필드 값 변경
        // 요청 데이터가 null이 아닌 경우에만 업데이트
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getIncome() != null) {
            user.setIncome(request.getIncome());
        }

        // 3. (Optional) save 호출: @Transactional이 있어 자동으로 반영되지만, 명시적으로 호출할 수도 있음
        // userRepository.save(user);
    }

    // 💡 [추가] 관리자용 전체 회원 목록 조회
    public List<AdminUserResponse> findAllUsersForAdmin() {
        // 1. UserRepository를 사용하여 모든 User 엔티티 조회
        List<User> users = userRepository.findAll(); // UserRepository에 findAll() 메소드 존재 가정

        // 2. User 엔티티 목록을 AdminUserResponse DTO 목록으로 변환(Mapping)
        return users.stream()
                .map(AdminUserResponse::new)
                .collect(Collectors.toList());
    }

    // 💡 [추가] 관리자에 의한 회원 정보 수정 (Update)
    public void updateUserByAdmin(String userId, UserUpdateRequest request) {
        // 1. 사용자 ID로 사용자 엔티티를 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // 2. 요청 DTO를 기반으로 필드 업데이트
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        // 🔑 핵심: ROLE 수정 허용
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        // 3. DB에 저장
        userRepository.save(user);
    }

    // 💡 [추가] 관리자에 의한 회원 삭제 (Delete)
    public void deleteUser(String userId) {
        // 1. 사용자 ID로 사용자 엔티티를 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // 2. DB에서 삭제
        userRepository.delete(user);
    }
}


