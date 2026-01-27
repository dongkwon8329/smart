// src/pages/LoginPage.js (수정된 코드)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { motion } from 'framer-motion';

// 💡 애니메이션 설정 (유지)
const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
};
const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
};

const LoginPage = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    userId: '',
    password: ''
  });

  // API_BASE_URL은 기존대로 유지됩니다. (예시: http://localhost:8080/api/users)
  const API_BASE_URL = 'http://localhost:8080/api/users';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.userId || !loginData.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const dataToSend = {
      userId: loginData.userId,
      password: loginData.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        let userName = loginData.userId;
        let token = null;
        let userIdFromResponse = loginData.userId;
        // 🔑 [신규] role 변수 초기화
        let role = 'USER';

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            token = result.token;

            // 🔑 [핵심 수정 1] 응답에서 userId, name, 그리고 role 값을 추출합니다.
            userIdFromResponse = result.userId || loginData.userId;
            userName = result.name || loginData.userId;
            role = result.role || 'USER'; // 서버에서 role을 받습니다.

            // 🔑 [핵심 수정 2] role 값을 localStorage에 저장합니다.
            localStorage.setItem('userRole', role);
        }

        // 🔑 [핵심 수정 3] userId를 localStorage에 별도로 저장
        if (userIdFromResponse) {
            localStorage.setItem('userId', userIdFromResponse);
        }

        // JWT 토큰 저장
        if (token) {
            localStorage.setItem('jwtToken', token);
        } else {
            console.warn("로그인 성공했으나 서버로부터 토큰을 받지 못했습니다.");
        }

        if (onLoginSuccess) {
            onLoginSuccess(userName);
        }

        alert(`✅ ${userName}님 로그인 성공!`);

        // 🔑 [핵심 수정 4] role 값에 따라 라우팅 경로를 분기합니다.
        if (role === 'ADMIN') {
             navigate('/admin'); // 관리자 페이지로 이동
        } else {
             navigate('/'); // 일반 사용자 메인 페이지로 이동 (기존 로직)
        }

      } else {
        const errorText = await response.text();
        // 백엔드에서 에러 메시지를 평문으로 보냈을 경우를 대비하여 처리
        const message = errorText || '아이디 또는 비밀번호를 확인해주세요.';
        alert(`❌ 로그인 실패: ${message}`);
      }
    } catch (error) {
      console.error("로그인 중 네트워크 오류 발생:", error);
      alert("네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
    }
  };

  return (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
            padding: '40px',
            maxWidth: '400px',
            margin: '50px auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}
    >
        <div className="login-page">
          <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="userId">아이디 *</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={loginData.userId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="login-button">로그인</button>
            </form>
          </div>
        </div>
    </motion.div>
  );
};

export default LoginPage;