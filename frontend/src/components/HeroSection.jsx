import React from 'react';
// import './HeroSection.css'; // Tailwind CSS를 사용하면 별도 CSS 파일은 불필요
import heroImage from '../assets/hero_growth_city_illustration.png'; // 새로 생성된 이미지 파일 경로 (src/assets 폴더에 저장했다고 가정)

function HeroSection() {
  return (
    <section className="hero-section flex flex-col items-center justify-center min-h-screen text-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white"> {/* 배경 그라데이션 추가 */}
      {/* 메인 헤딩 */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight mb-4 animate-fade-in-up">
        당신의 미래를 위한 가장 쉬운 경로.
      </h1>

      {/* 서브 헤딩 */}
      <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl animate-fade-in-up delay-100">
        K-Digital Smart App이 금융, 실무, 커리어를 하나로 연결합니다.
      </p>

      {/* 히어로 이미지 */}
      <div className="hero-image-container relative mb-12 w-full max-w-4xl animate-fade-in delay-200">
        <img
          src={heroImage}
          alt="K-Digital Smart App - Growth City Illustration"
          className="mx-auto w-4/5 md:w-3/4 lg:w-2/3 object-contain" // 이미지 크기 조정
        />
      </div>

      {/* CTA 버튼 */}
      <button className="cta-button bg-kdsa-blue hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up delay-300">
        내 미래 설계 시작
      </button>
    </section>
  );
}

export default HeroSection;