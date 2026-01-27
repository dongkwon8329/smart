
import React, { useState } from "react";
import { motion } from 'framer-motion'; // 🔑 [추가] framer-motion import

// 💡 애니메이션 설정 (모든 파일에 동일하게 적용)
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

const AboutPage = ({ isAdmin }) => {
  const [introText, setIntroText] = useState(`
    “당신에게 최적화된 적금 선택, 이제 스마트하게 시작하세요.”
    급변하는 금융 환경 속에서 수많은 적금 상품 중에서 내게 가장 알맞은 상품을 찾는 일은 결코 쉽지 않습니다. 저희 스마트 적금 추천 플랫폼은 이러한 고민을 해결하기 위해 설계되었습니다.

    먼저, 시중에 출시된 다양한 적금 상품을 한눈에 확인하고 비교할 수 있도록 구성하여, 복잡한 금융 정보를 보다 직관적으로 이해할 수 있습니다. 단순히 정보를 제공하는 것을 넘어, 간단한 설문조사 결과를 기반으로 사용자의 금융 성향과 목표에 최적화된 맞춤형 적금을 추천하여, 개인별 재무 계획 수립을 지원합니다.

    또한, 용인시 내 은행 점포를 지도에서 시각적으로 확인할 수 있으며, 현재 위치를 기반으로 가까운 은행까지 쉽게 찾을 수 있어, 온라인에서의 정보 확인과 오프라인 방문을 자연스럽게 연결합니다.

    이제 금융 상품 선택의 고민에서 벗어나, 나에게 가장 적합한 적금을 손쉽게 찾아 실현할 수 있습니다. 스마트 적금 추천 플랫폼과 함께라면, 계획적인 저축과 현명한 금융 생활이 더 이상 어렵지 않습니다.`
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(introText);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // 💡 [TODO] 백엔드 API를 통해 저장하는 로직 필요
    setIntroText(tempText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setTempText(introText);
    setIsEditing(false);
  };

  return (
    // 🔑 [핵심] motion.div를 최상위 요소로 사용하고 애니메이션 속성 추가
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        backgroundColor: "#f4f6fb",
        minHeight: "100vh",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* 상단 배너 */}
      <div
        style={{
          background: "linear-gradient(90deg, #0047AB 0%, #1976d2 100%)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700", margin: 0 }}>
          💡 스마트 세이빙 플랫폼 소개
        </h1>
        <p style={{ opacity: 0.9, marginTop: "10px", fontSize: "1.1rem" }}>
          당신의 금융 여정을 함께하는 신뢰의 파트너
        </p>
      </div>

      {/* 본문 */}
      <div
        style={{
          maxWidth: "900px",
          margin: "50px auto",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: "40px 50px",
          lineHeight: 1.8,
          color: "#333",
        }}
      >
        {isEditing ? (
          <>
            <textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              style={{
                width: "100%",
                minHeight: "200px",
                fontSize: "16px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                resize: "none",
                lineHeight: 1.6,
                outline: "none",
              }}
            />
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={handleSaveClick}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 25px",
                  fontSize: "15px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                저장
              </button>
              <button
                onClick={handleCancelClick}
                style={{
                  backgroundColor: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 25px",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ whiteSpace: "pre-line", fontSize: "17px" }}>
              {introText}
            </p>
            {isAdmin && (
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  onClick={handleEditClick}
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "10px 25px",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
                  }}
                >
                  ✏️ 수정
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AboutPage;