import React from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css'; // ⬅️ Tailwind CSS를 사용하므로 이 파일은 제거하거나 Tailwind 환경에 맞춰야 합니다.

// --- 디자인 상수 정의 (App.jsx 또는 별도 Config 파일에서 가져와야 하지만, 편의상 여기에 정의) ---
const KDSA_BLUE = '#3478F6';
const KDSA_TEXT_DARK = '#222222';
const FONT_FAMILY = 'Pretendard, sans-serif'; // CSS에서 임포트 필요

const Navbar = ({ isLoggedIn = false, userName = "회원", onLogout = () => console.log('로그아웃 기능 호출') }) => {
    return (
        // 1. 네비게이션 컨테이너 (Fixed, Shadow, 중앙 정렬)
        <nav
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 px-8 flex items-center justify-between"
            style={{ fontFamily: FONT_FAMILY }}
        >
            {/* 1. 로고 (좌측 - Blue & Bold) */}
            <div className="flex items-center">
                <Link to="/"
                      className="text-2xl font-extrabold tracking-tight"
                      style={{ color: KDSA_BLUE }}>
                    K-Digital Smart App
                </Link>
            </div>

            {/* 2. 주요 기능 메뉴 (중앙 - flex-grow와 justify-center로 중앙 정렬) */}
            <div className="flex-grow flex justify-center hidden md:flex">
                <div className="flex space-x-10 text-gray-700 font-medium">
                    <Link to="/savings" className="hover:text-blue-500 transition duration-200">적금소개</Link>
                    <Link to="/survey" className="hover:text-blue-500 transition duration-200">설문조사</Link>
                    <Link to="/category" className="hover:text-blue-500 transition duration-200">카테고리</Link>
                </div>
            </div>

            {/* 3. 사용자 및 인증 (우측) - 조건부 렌더링 */}
            <div className="flex items-center space-x-3 text-sm">
                {isLoggedIn ? (
                    // 🟢 로그인 상태일 때
                    <>
                        <span className="text-gray-600 font-medium whitespace-nowrap hidden sm:inline">
                            {userName}님 환영합니다!
                        </span>
                        <Link to="/mypage" className="font-medium py-2 px-4 rounded-full transition duration-200 hover:bg-gray-100">
                            마이페이지
                        </Link>
                        {/* 로그아웃: 일반 버튼 스타일 */}
                        <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition duration-200" onClick={onLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    // 🔴 로그아웃 상태일 때 (토스 스타일 적용)
                    <>
                        {/* 로그인: 고스트 버튼 (테두리만 있는 버튼) */}
                        <Link to="/login"
                              style={{ color: KDSA_BLUE, borderColor: KDSA_BLUE }}
                              className="font-medium py-2 px-4 rounded-full border-2 transition duration-200 hover:bg-blue-50">
                            로그인
                        </Link>
                        {/* 회원가입: Primary Color 채워진 버튼 */}
                        <Link to="/signup"
                              style={{ backgroundColor: KDSA_BLUE }}
                              className="text-white font-medium py-2 px-4 rounded-full transition duration-200 hover:bg-blue-600 shadow-md">
                            회원가입
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;