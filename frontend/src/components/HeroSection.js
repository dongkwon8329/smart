import React from "react";

function HeroSection() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 70px)",
        textAlign: "center",
        background: "linear-gradient(to bottom, #e8f0ff, #ffffff)",
        padding: "50px 20px",
      }}
    >
      {/* 메인 헤딩 */}
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          color: "#222",
          marginBottom: "20px",
        }}
      >
        당신의 미래를 위한 <br /> 가장 쉬운 경로.
      </h1>

      {/* 서브 헤딩 */}
      <p
        style={{
          fontSize: "18px",
          color: "#555",
          maxWidth: "600px",
          marginBottom: "50px",
        }}
      >
        K-Digital Smart App이 금융, 실무, 커리어를 하나로 연결합니다.
      </p>

      {/* 이미지 대신 비주얼 박스 (옵션) */}
      <div
        style={{
          width: "80%",
          height: "200px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #c3d9ff, #eaf1ff)",
          marginBottom: "50px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      ></div>

      {/* CTA 버튼 */}
      <button
        style={{
          backgroundColor: "#3478f6",
          color: "white",
          border: "none",
          padding: "15px 40px",
          borderRadius: "30px",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2f68e5")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3478f6")}
      >
        내 미래 설계 시작
      </button>
    </section>
  );
}

export default HeroSection;
