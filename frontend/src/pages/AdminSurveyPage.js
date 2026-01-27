import React, { useEffect, useState } from "react";
// 💡 CSS 파일을 import 합니다. (새로운 파일 생성 필요)
import "./AdminSurveyPage.css";

const AdminSurveyPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 JWT 토큰을 가져와 헤더를 생성하는 함수
  const getAuthHeaders = (method = "GET", contentType = null) => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    return {
      method: method,
      headers: headers,
    };
  };

  // 설문 전체 조회 (READ)
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("❌ 인증 토큰이 없습니다. 관리자 로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/admin/surveys", getAuthHeaders())
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        }
        return [];
      })
      .then((data) => {
        setSurveys(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("설문 조회 실패:", err);
        setError(`설문 조회 실패: ${err.message}. (권한/서버 상태 확인 필요)`);
        setLoading(false);
      });
  }, []);

  // 수정 버튼 클릭 시 편집 모드로 전환
  const handleEdit = (survey) => {
    setEditingSurvey(survey);
  };

  // 수정 저장 (UPDATE)
  const handleSave = () => {
    const requestOptions = {
      ...getAuthHeaders("PUT", "application/json"),
      body: JSON.stringify(editingSurvey),
    };

    fetch(`http://localhost:8080/api/admin/surveys/${editingSurvey.userId}`, requestOptions)
      .then((res) => {
        if (!res.ok) throw new Error("수정 실패");
        alert("수정 완료");
        setEditingSurvey(null);
        window.location.reload();
      })
      .catch((err) => console.error("수정 실패:", err));
  };

  // 설문 삭제 (DELETE)
  const handleDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/admin/surveys/${id}`, getAuthHeaders("DELETE"))
        .then((res) => {
          if (!res.ok) throw new Error("삭제 실패");
          alert("삭제 완료");
          setSurveys(surveys.filter((s) => s.userId !== id));
        })
        .catch((err) => console.error("삭제 실패:", err));
    }
  };

  // 로딩 및 오류 상태 처리 (클래스 적용)
  if (loading) return <div className="admin-status loading">데이터 로딩 중...</div>;
  if (error) return <div className="admin-status error">{error}</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-title">📋 설문조사 관리 페이지</h2>

      <div className="table-wrapper">
        <table className="survey-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>직업</th>
              <th>나이</th>
              <th>소득(만원)</th>
              <th>저축목표</th>
              <th>기간(개월)</th>
              <th>위험성향</th>
              <th>금융지식</th>
              <th>선호은행</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {surveys.length === 0 ? (
              <tr className="no-data-row">
                <td colSpan="10">조회된 설문 내역이 없습니다.</td>
              </tr>
            ) : (
              surveys.map((s) => (
                <tr key={s.userId} className={editingSurvey && editingSurvey.userId === s.userId ? 'editing-row' : ''}>
                  <td>{s.userId}</td>

                  {editingSurvey && editingSurvey.userId === s.userId ? (
                    <>
                      {/* 수정 모드 입력 필드 */}
                      <td data-label="직업"><input className="admin-input" value={editingSurvey.job} onChange={(e) => setEditingSurvey({ ...editingSurvey, job: e.target.value })} /></td>
                      <td data-label="나이"><input className="admin-input" type="number" value={editingSurvey.age} onChange={(e) => setEditingSurvey({ ...editingSurvey, age: e.target.value })} /></td>
                      <td data-label="소득"><input className="admin-input" type="number" value={editingSurvey.income} onChange={(e) => setEditingSurvey({ ...editingSurvey, income: e.target.value })} /></td>
                      <td data-label="저축목표"><input className="admin-input" value={editingSurvey.savingGoal} onChange={(e) => setEditingSurvey({ ...editingSurvey, savingGoal: e.target.value })} /></td>
                      <td data-label="기간"><input className="admin-input" type="number" value={editingSurvey.savingPeriod} onChange={(e) => setEditingSurvey({ ...editingSurvey, savingPeriod: e.target.value })} /></td>
                      <td data-label="위험성향"><input className="admin-input" value={editingSurvey.riskPreference} onChange={(e) => setEditingSurvey({ ...editingSurvey, riskPreference: e.target.value })} /></td>
                      <td data-label="금융지식"><input className="admin-input" type="number" value={editingSurvey.financialKnowledge} onChange={(e) => setEditingSurvey({ ...editingSurvey, financialKnowledge: e.target.value })} /></td>
                      <td data-label="선호은행"><input className="admin-input" value={editingSurvey.preferredBank} onChange={(e) => setEditingSurvey({ ...editingSurvey, preferredBank: e.target.value })} /></td>

                      <td className="admin-actions">
                        <button className="btn-save" onClick={handleSave}>저장</button>
                        <button className="btn-cancel" onClick={() => setEditingSurvey(null)}>취소</button>
                      </td>
                    </>
                  ) : (
                    // 일반 모드
                    <>
                      <td>{s.job}</td>
                      <td>{s.age}</td>
                      <td>{s.income}</td>
                      <td>{s.savingGoal}</td>
                      <td>{s.savingPeriod}</td>
                      <td>{s.riskPreference}</td>
                      <td>{s.financialKnowledge}</td>
                      <td>{s.preferredBank}</td>
                      <td className="admin-actions">
                        <button className="btn-edit" onClick={() => handleEdit(s)}>수정</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.userId)}>삭제</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSurveyPage;