// src/pages/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MainPage.css'; // ✅ 기존 스타일 유지

// 디자인 상수
const KDSA_BLUE = '#3478F6';
const KDSA_TEXT_DARK = '#222222';
const KDSA_SUB_TEXT_COLOR = '#666666';

// 💡 애니메이션 설정
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

const MainPage = () => {
  return (
    // 🔑 [핵심 수정] motion.div를 유일한 최상위 요소로 사용하고,
    // 모든 콘텐츠를 이 안에 넣습니다.
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="main-page-container" // 기존 스타일 클래스 유지
    >
        {/* ✅ 기존 MainPage 영역 전체 */}
        <section className="main-container">
            {/* 1. 메인 헤딩 */}
            <h1 className="main-heading">
                당신의 미래를 위한 <br className="hidden-sm" /> 가장 쉬운 경로.
            </h1>

            {/* 2. 서브 헤딩 */}
            <p className="sub-heading">
                K-Digital Smart App이 금융, 실무, 커리어를 하나로 연결합니다.
            </p>

            {/* 3. CTA 버튼 */}
            <Link to="/signup" className="cta-button" style={{ backgroundColor: KDSA_BLUE }}>
                내 미래 설계 시작
            </Link>
        </section>

        {/*
        // ❌ [제거] 기존 코드에서 분리되어 있던 <>... </> 또는 <section> 영역을 제거하고,
        // 모든 내용을 motion.div 안에 통합했습니다.
        // HeroSection 컴포넌트가 있다면, 이 section 태그 위에 바로 추가해야 합니다.
        // <HeroSection 컴포넌트/>
        */}
    </motion.div>
  );
};

export default MainPage;