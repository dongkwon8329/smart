// src/pages/MainPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// --- 디자인 상수 ---
const KDSA_BLUE = '#3478F6';
const KDSA_TEXT_DARK = '#222222'; // 텍스트 색상
const KDSA_SUB_TEXT_COLOR = '#666666'; // 서브 텍스트 색상

const MainPage = () => {
    return (
        // 섹션 컨테이너: 배경 그라데이션, 화면 중앙 정렬, 상단 Navbar 공간 확보
        <section
            className="flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white"
            style={{ minHeight: 'calc(100vh - 64px)' }} // Navbar 높이만큼 제외
        >
            {/* 1. 메인 헤딩 */}
            <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-10 mb-5 tracking-tight animate-fade-in-up"
                style={{ color: KDSA_TEXT_DARK }}
            >
                당신의 미래를 위한 <br className="hidden sm:inline"/> 가장 쉬운 경로.
            </h1>

            {/* 2. 서브 헤딩 */}
            <p className="text-md md:text-lg lg:text-xl mb-12 max-w-xl animate-fade-in-up delay-100"
               style={{ color: KDSA_SUB_TEXT_COLOR }}>
                K-Digital Smart App이 금융, 실무, 커리어를 하나로 연결합니다.
            </p>



            {/* 4. CTA 버튼 (이미지 아래에 배치) */}
            <Link
                to="/signup" // 회원가입 라우트로 연결
                style={{ backgroundColor: KDSA_BLUE }}
                className="text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 animate-fade-in-up delay-300"
            >
                내 미래 설계 시작
            </Link>

        </section>
    );
};

export default MainPage;