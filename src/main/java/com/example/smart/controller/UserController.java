package com.example.smart.controller;
// src/main/java/com/app/controller/UserController.java
import com.example.smart.dto.UserSignUpRequest;
import com.example.smart.dto.UserLoginRequest;
import com.example.smart.service.MyPageService;
import com.example.smart.service.UserService;
// 💡 [추가] JWT 토큰을 생성하는 서비스 또는 유틸리티 (실제 프로젝트 구조에 맞게 변경)
import com.example.smart.security.JwtTokenProvider;
import com.example.smart.entity.User; // 사용자 정보를 가져오기 위해 필요
import com.example.smart.repository.UserRepository; // 사용자 정보를 가져오기 위해 필요
import com.example.smart.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap; // Map 사용을 위해 추가
import java.util.Map; // Map 사용을 위해 추가
import java.util.Optional; // UserRepository 사용을 위해 추가
import org.springframework.security.core.userdetails.UsernameNotFoundException; // 예외 처리용 추가

@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.POST})

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    // 💡 [추가] JWT 토큰 생성을 위한 의존성 주입
    private final JwtTokenProvider jwtTokenProvider;
    // 💡 [추가] 로그인 후 사용자 이름 등을 가져오기 위한 UserRepository 의존성 주입
    private final UserRepository userRepository;

    // 💡 POST /api/users/signup
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserSignUpRequest request) {

        System.out.println("📩 회원가입 요청 들어옴: " + request);

        try {

            userService.signUp(request);
            // HTTP 201 Created 반환
            return new ResponseEntity<>("회원가입 성공", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {

            // 이름 중복 등의 비즈니스 로직 오류 (HTTP 400 Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 💡 POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        try {
            // 1. 서비스에서 인증 로직을 실행하고 성공 여부만 확인
            userService.login(request);

            // 2. 인증이 성공했다면, 사용자 정보를 다시 조회하여 토큰을 생성하고 반환합니다.
            Optional<User> userOptional = userRepository.findByUserId(request.getUserId());
            if (userOptional.isEmpty()) {
                // 이 예외는 BCrypt 비밀번호 문제가 해결되면 발생하지 않습니다.
                throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
            }
            User user = userOptional.get();

            // 3. JWT 토큰 생성
            // [주의] 이 부분은 실제 JwtTokenProvider의 메서드 시그니처와 일치해야 합니다.
            // ROLE 정보가 토큰에 포함되도록 시그니처가 바뀌어야 할 수도 있습니다.
            String jwtToken = jwtTokenProvider.createToken(user.getUserId());

            // 4. 응답 데이터 구성 (프론트엔드가 요구하는 token, name 필드 포함)
            Map<String, String> responseData = new HashMap<>();
            responseData.put("userId", user.getUserId());
            responseData.put("name", user.getName());
            responseData.put("token", jwtToken);

            // 🔑 [핵심 수정] ROLE 정보를 응답 데이터에 추가합니다.
            responseData.put("role", user.getRole());

            // 💡 [디버깅 로그] 어떤 ROLE을 보내는지 콘솔에 출력
            System.out.println("✅ 로그인 성공 - 응답 데이터 ROLE: " + user.getRole());

            // HTTP 200 OK와 함께 JSON 데이터 반환
            return ResponseEntity.ok(responseData);

        } catch (IllegalArgumentException e) {
            // 인증 실패 오류 (HTTP 401 Unauthorized 또는 400 Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>("로그인 실패: 사용자 정보를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
        }
    }

    @RestController
    @RequestMapping("/api/mypage")
    @RequiredArgsConstructor
    public class MyPageController {

        private final MyPageService myPageService;
        private final UserService userService; // 💡 [추가] UserService 주입

        // ... (getMyInfo 메서드 유지)

        // 💡 [추가] PUT /api/mypage/update
        @PutMapping("/update") // HTTP PUT 메서드 사용
        public ResponseEntity<Void> updateUserInfo(
                Authentication authentication,
                @RequestBody UserUpdateRequest request) {

            String userId = authentication.getName();
            userService.updateUserInfo(userId, request);

            // HTTP 204 No Content 또는 200 OK 반환 (성공적으로 처리되었음을 알림)
            return ResponseEntity.ok().build();
        }
    }

}