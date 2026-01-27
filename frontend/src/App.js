import React, { useState, useEffect } from 'react'; // 🔑 [수정] useEffect import 추가
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import SurveyForm from "./pages/SurveyForm";
import RecommendResult from "./pages/RecommendResult";
import BankMap from './components/BankMap.js';
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MyPageLayout from './pages/MyPageLayout';
import MyPageInfo from './pages/MyPageInfo';
import SurveyHistory from './pages/SurveyHistory';
import ProfileEdit from './pages/ProfileEdit';
import ChatPage from './pages/ChatPage';
import FloatingChatButton from './components/FloatingChatButton';
import SavingList from './pages/SavingList';
import SavingDetail from "./pages/SavingDetail";
import AdminMainPage from './pages/AdminMainPage';
import AdminRoute from './components/AdminRoute';
import SavingAdminPage from "./pages/SavingAdminPage";

import './App.css';

// 🔑 [함수 추가] localStorage의 인증 정보를 정리하여 로그아웃 상태로 시작하도록 보장
const clearAuthOnStartup = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  // 🔑 [핵심 추가] 앱이 처음 마운트될 때 세션 초기화
  useEffect(() => {

        const role = localStorage.getItem("userRole");
            setUserRole(role);
      // ⚠️ 개발 편의를 위한 임시 조치입니다. 배포 전 반드시 이 호출을 제거하거나 주석 처리해야 합니다.
      clearAuthOnStartup();

      // 혹시 로그아웃 상태에서 시작했더라도, 수동으로 로그인 시도 시 상태를 업데이트하도록 확인
      if (localStorage.getItem('jwtToken') && !isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(localStorage.getItem('userId') || '사용자');
      }
  }, []); // 마운트 시 한 번만 실행

  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    // 💡 로그인 후 경로 이동은 LoginPage.js 내부에서 role에 따라 처리됩니다.
  };

  const handleLogout = () => {
    // 💡 로그아웃 시 localStorage 정리
    clearAuthOnStartup();
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className="content-padding">
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>

                {/* === NESTED MYPAGE ROUTE SETUP === */}
                <Route path="/mypage" element={<MyPageLayout />}>
                    <Route index element={<MyPageInfo />} />
                    <Route path="info" element={<MyPageInfo />} />
                    <Route path="surveys" element={<SurveyHistory />} />
                    <Route path="edit" element={<ProfileEdit />} />
                </Route>

                {/* === TOP-LEVEL ROUTES === */}
                {/* ❌ 중복 경로 정리 (가정: 하나만 남김) */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/savings" element={<SavingList />} />
                <Route path="/savings/:id" element={<SavingDetail />} />
                <Route path="/survey" element={<SurveyForm />} />
                <Route path="/recommend" element={<RecommendResult />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/branches" element={<BankMap />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/admin/savings" element={<SavingAdminPage />} />
                {/* 🔑 [수정] LoginPage는 onLoginSuccess만 받습니다. */}
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

                <Route path="/signup" element={<SignupPage />} />
                <Route path="/chat" element={<ChatPage />} />

                {/* 🔑 [관리자 라우트] */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminMainPage />} />
                </Route>

            </Routes>
        </AnimatePresence>
      </div>
      <FloatingChatButton />
    </>
  );
}

export default App;