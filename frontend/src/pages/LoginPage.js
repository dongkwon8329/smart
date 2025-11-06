// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

// ⬅️ [수정] onLoginSuccess 함수를 props로 받습니다.
const LoginPage = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    userId: '',
    password: ''
  });

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
        // 💡 [핵심 수정] 로그인 성공 후 상태 업데이트

        const contentType = response.headers.get("content-type");
        let userName = loginData.userId; // 기본값은 입력한 아이디로 설정

        if (contentType && contentType.indexOf("application/json") !== -1) {
            // 서버 응답 본문에서 사용자 이름(name)을 가져온다고 가정
            const result = await response.json();
            // 서버 응답에 'name' 필드가 있다면 사용하고, 없으면 로그인 ID 사용
            userName = result.name || loginData.userId;
        }

        // ⬅️ App.jsx의 상태를 업데이트하여 Navbar UI를 전환합니다.
        if (onLoginSuccess) {
            onLoginSuccess(userName);
        }

        alert(`✅ ${userName}님 로그인 성공!`);
        navigate('/');
      } else {
        const errorText = await response.text();
        const message = errorText || '아이디 또는 비밀번호를 확인해주세요.';
        alert(`❌ 로그인 실패: ${message}`);
      }
    } catch (error) {
      console.error("로그인 중 네트워크 오류 발생:", error);
      alert("네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
    }
  };

  // ... (return 이하의 JSX 코드는 이전과 동일)
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          {/* ... 아이디 및 비밀번호 입력 필드 유지 ... */}
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
  );
};

export default LoginPage;