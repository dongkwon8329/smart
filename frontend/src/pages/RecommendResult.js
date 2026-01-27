import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // 💡 useLocation 추가
import { motion } from 'framer-motion';

// 애니메이션 variants (기존 설정과 동일)
const pageVariants = { initial: { opacity: 0, x: 50 }, in: { opacity: 1, x: 0 }, out: { opacity: 0, x: -50 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };

const RecommendResult = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 💡 설문 폼에서 넘겨준 state를 받기 위해 useLocation 사용

  // SurveyForm에서 state로 넘어온 데이터를 초기값으로 사용합니다.
  const [recommendations, setRecommendations] = useState(location.state?.recommended || []);
  const [survey, setSurvey] = useState(null);

  // 🔑 [추가] 인증 헤더를 가져오는 함수
  const getAuthHeaders = () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return { headers: {} };
      return {
          headers: { 'Authorization': `Bearer ${token}` }
      };
  };

  const calcScore = (p) => {
    if (!survey) return 0;
    // ... (기존 calcScore 로직 유지)
    let score = 0;
    score -= Math.abs(p.period - survey.savingPeriod);
    score += parseInt(p.interestRate * 10);
    return score;
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // 🔑 [수정] 토큰이 없거나, 이미 추천 리스트를 받았다면 API 호출을 막습니다.
    if (!userId || recommendations.length > 0) return;

    const fetchAdditionalData = async () => {
        try {
            // 1. 설문 정보 조회 (JWT 헤더 추가!)
            const surveyRes = await axios.get(`http://localhost:8080/api/survey/user/${userId}`, getAuthHeaders());
            setSurvey(surveyRes.data);

            // 2. 추천 상품 조회 (JWT 헤더 추가! - 안전을 위해 재요청)
            if (recommendations.length === 0) {
                 const recommendRes = await axios.get(`http://localhost:8080/api/survey/recommend/top3/${userId}`, getAuthHeaders());
                 setRecommendations(recommendRes.data);
            }

        } catch (err) {
             console.error("추천 결과 로드 중 오류 발생 (403 가능성):", err);
             // 403/401 에러 시 리디렉션 처리
             if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                 alert("권한이 없습니다. 다시 로그인 해주세요.");
                 navigate('/login');
             }
        }
    };

    // 💡 SurveyForm에서 데이터를 넘겨주지 않았을 경우에만 API를 실행합니다.
    if (!location.state?.recommended) {
        fetchAdditionalData();
    } else {
        // 설문 정보 (survey)는 여전히 필요하므로, 별도로 조회합니다.
        axios.get(`http://localhost:8080/api/survey/user/${userId}`, getAuthHeaders())
            .then(res => setSurvey(res.data))
            .catch(err => console.error("설문 정보 로드 실패:", err));
    }
  }, [navigate, location.state, recommendations.length]); // 의존성 배열 수정

  return (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={styles.pageWrapper} // 스타일을 최상위 motion.div로 이동
    >
        <h2 style={styles.pageTitle}>🔥 당신에게 가장 잘 맞는 적금 TOP 3</h2>

        <div style={styles.cardGrid}>
            {recommendations.map((item, index) => (
                <div
                    key={index}
                    style={styles.card}
                    // ... (기존 onMouseOver/onMouseOut 로직 유지)
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-10px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.18)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.12)";
                    }}
                >
                    <div style={styles.rankCircle}>{index + 1}</div>
                    <h3 style={styles.productName}>{item.productName}</h3>
                    <p style={styles.bankName}>{item.bankName}</p>

                    <div style={styles.infoLine}>
                        <span>기간</span>
                        <strong>{item.period}개월</strong>
                    </div>

                    <div style={styles.infoLine}>
                        <span>금리</span>
                        <strong>{item.interestRate}%</strong>
                    </div>

                    {survey && (
                        <>
                            <div style={styles.barWrapper}>
                                <div
                                    style={{
                                        ...styles.barFill,
                                        width: `${calcScore(item) * 3}%`,
                                    }}
                                ></div>
                            </div>
                            <p style={styles.percentLabel}>
                                추천점수 {calcScore(item)} pts
                            </p>
                        </>
                    )}
                </div>
            ))}
        </div>

        {/* ✅ 다시 설문하기 버튼 */}
        <button
            style={styles.reSurveyBtn}
            onClick={() => navigate("/survey")}
        >
            다시 설문하기
        </button>
    </motion.div>
  );
};


// 💡 [수정] styles 객체를 motion.div에 맞게 최적화
const styles = {
  pageWrapper: {
    padding: "50px 80px",
    background: "linear-gradient(135deg, #f0f4ff, #e8eeff)",
    minHeight: "100vh",
    textAlign: "center",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "50px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "40px",
    paddingBottom: "60px",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    padding: "36px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    transition: "all 0.25s",
    cursor: "pointer",
  },
  rankCircle: {
    width: "48px",
    height: "48px",
    background: "#4c74ff",
    color: "#fff",
    borderRadius: "50%",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
  },
  productName: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  bankName: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "22px",
  },
  infoLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
    fontSize: "17px",
  },
  barWrapper: {
    width: "100%",
    height: "14px",
    background: "#ebebeb",
    borderRadius: "12px",
    marginTop: "18px",
    overflow: "hidden",
  },
  barFill: {
    height: "14px",
    background: "#4c74ff",
    borderRadius: "12px",
    transition: "width 0.3s",
  },
  percentLabel: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#333",
    textAlign: "right",
  },

  // ✅ 버튼 스타일
  reSurveyBtn: {
    marginTop: "40px",
    padding: "16px 34px",
    background: "#4c74ff",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    transition: "0.2s",
  },
};

export default RecommendResult;