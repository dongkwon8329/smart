import React, { useState } from "react";
import axios from "axios";
import "./SurveyForm.css";
import { useNavigate } from "react-router-dom";

function SurveyForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    job: "",
    age: "",
    income: "",
    savingGoal: "",
    savingPeriod: "",
    riskPreference: "",
    financialKnowledge: "",
    preferredBank: "",
  });

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommended] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const userIdFromStorage = localStorage.getItem("userId");
    const token = localStorage.getItem("jwtToken"); // 🔑 [추가] 토큰 가져오기

    if (!userIdFromStorage || !token) { // 🔑 [수정] 토큰이 없어도 오류 메시지 표시
        setMessage("❌ 오류: 로그인된 사용자 정보 또는 유효한 토큰이 없습니다.");
        setLoading(false);
        return;
    }
    const dataToSubmit = { ...form, userId: userIdFromStorage };

    try {
      // 1) 설문 저장 (POST)
      await axios.post(
        "http://localhost:8080/api/survey/submit",
        dataToSubmit,
        {
          // 🔑 [핵심 수정] Authorization 헤더 추가
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage({ text: "✅ 설문이 저장되었습니다!", isError: false});

      // 2) 저장된 설문 데이터 조회 (GET)
      const resultRes = await axios.get(
        `http://localhost:8080/api/survey/user/${userIdFromStorage}`,
        {
          // 🔑 [핵심 수정] GET 요청에도 Authorization 헤더 추가
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setResult(resultRes.data);

    } catch (err) {
      console.error(err.response?.data || err);
      // HTTP 403 Forbidden 에러 메시지 상세화
      if (err.response && err.response.status === 403) {
          setMessage({ text:"❌ 오류: 권한이 없습니다. (토큰 만료 혹은 접근 거부)", isError:true});
      } else {
          setMessage({ text:"❌ 오류가 발생했습니다. 다시 시도해주세요. (서버/DB 로그 확인 필요)", isError:true});
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔑 [수정] handleGetRecommendation에도 토큰 로직 추가 (함수 분리)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return {};
    return {
        headers: { 'Authorization': `Bearer ${token}` }
    };
  };


  const handleGoHome = () => {
    navigate("/");
  };

  const handleGetRecommendation = async () => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (!userIdFromStorage) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/survey/recommend/top3/${userIdFromStorage}`,
        getAuthHeaders() // ⬅️ 헤더 사용
      );

      navigate("/recommend", { state: { recommended: res.data } });

    } catch (err) {
      console.error(err);
      alert("추천 조회 실패");
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-card">
        <h2 className="survey-title">📋 스마트 적금 설문조사</h2>
        <p className="survey-subtext">당신의 성향에 맞는 맞춤형 적금 상품을 추천받아보세요!</p>

        <form className="survey-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>직업</label>
            <input name="job" value={form.job} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>나이</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>연소득 (만원)</label>
              <input type="number" name="income" value={form.income} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>적금 목적</label>
            <input name="savingGoal" value={form.savingGoal} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>목표 기간 (개월)</label>
              <input type="number" name="savingPeriod" value={form.savingPeriod} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>위험 성향</label>
              <select name="riskPreference" value={form.riskPreference} onChange={handleChange}>
                <option value="">선택</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>금융지식 (1~5)</label>
              <input type="number" name="financialKnowledge" value={form.financialKnowledge} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>선호 은행</label>
              <input name="preferredBank" value={form.preferredBank} onChange={handleChange} />
            </div>
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? "처리 중..." : "설문 제출"}
          </button>
        </form>

        {message.text && <p className="survey-message">{message.text}</p>}

        {result && (
          <div className="survey-result fade-in">
            <h3>📊 나의 설문 결과</h3>
            <ul>
                          <li><strong>직업:</strong> {result.job}</li>
                          <li><strong>나이:</strong> {result.age}</li>
                          <li><strong>연소득:</strong> {result.income} 만원</li>
                          <li><strong>적금 목적:</strong> {result.savingGoal}</li>
                          <li><strong>목표 기간:</strong> {result.savingPeriod} 개월</li>
                          <li><strong>위험 성향:</strong> {result.riskPreference}</li>
                          <li><strong>금융지식:</strong> {result.financialKnowledge}</li>
                          <li><strong>선호 은행:</strong> {result.preferredBank}</li>
                        </ul>
          </div>
        )}

        {result && (
          <div className="btn-area fade-in">
            <button onClick={handleGoHome} className="btn-home">🏠 메인으로</button>
            <button onClick={handleGetRecommendation} className="btn-recommend">
              ⭐ 나에게 맞는 적금 상품 추천받기
            </button>
          </div>
        )}

        {recommended.length > 0 && (
          <div className="recommend-list fade-in">
            <h3>🔥 TOP3 추천 적금</h3>
            <ul>
              {recommended.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.productName}</strong> ({item.bankName}) - 금리 {item.interestRate}%
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default SurveyForm;