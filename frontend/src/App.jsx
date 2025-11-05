// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import './index.css';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import MyPage from "./pages/MyPage";

function App() {
  // 1. 로그인 상태와 사용자 이름을 관리할 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // useNavigate 임포트 활용

  // 2. 로그인 성공을 처리하는 함수
  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    // 로그인 후 메인 페이지로 이동
    navigate('/');
  };

  // 3. 로그아웃을 처리하는 함수
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    // 로그아웃 후 메인 페이지로 이동
    navigate('/');
    // 토큰 삭제 등 백엔드 로그아웃 로직 추가 필요
  };

  return (
    <>
      {/* 1. [추가] 전역 스타일링을 위한 style 태그 (폰트 임포트 및 기본 폰트 설정) */}
      <style>

      </style>

      {/* Navbar에 상태와 로그아웃 함수 전달 */}
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* 2. [추가] Navbar 높이만큼 패딩을 추가하여 콘텐츠가 Navbar 아래에 오도록 설정 */}
      <div className="content-padding">
          <Routes>
            <Route path="/" element={<MainPage />} />

            {/* LoginPage에 로그인 성공 핸들러 전달 */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            <Route path="/signup" element={<SignupPage />} />

            {/* 마이페이지 라우트 (예시) */}
            {/* {isLoggedIn && <Route path="/mypage" element={<MyPage />} />} */}

            {/* 나머지 라우트... */}
          </Routes>
      </div>
    </>
  );
}

export default App;