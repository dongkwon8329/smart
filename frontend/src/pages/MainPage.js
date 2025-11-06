// src/pages/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';

import './MainPage.css'; // ✅ 기존 스타일 유지

// 디자인 상수
const KDSA_BLUE = '#3478F6';
const KDSA_TEXT_DARK = '#222222';
const KDSA_SUB_TEXT_COLOR = '#666666';

const MainPage = () => {
  return (
    <>
      {/* ✅ HeroSection 컴포넌트 추가 */}


      {/* ✅ 아래는 기존 MainPage 영역 */}
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
    </>
  );
};

export default MainPage;
