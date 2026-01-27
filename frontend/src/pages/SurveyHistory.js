import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 💡 axios 라이브러리를 사용합니다.

function SurveyHistory() {
  // 1. 상태 관리: 데이터, 로딩 상태, 에러 상태 정의
  const [surveyData, setSurveyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. 데이터 호출 로직 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    // API 호출 함수 정의
    const fetchSurveyHistory = async () => {
      try {
        const response = await axios.get('/api/mypage/surveys', {
          // 💡 참고: 실제 환경에서는 인증 토큰을 헤더에 추가해야 합니다.
          // headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });

        // 데이터 저장 및 로딩 상태 해제
        setSurveyData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch survey history:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchSurveyHistory();
  }, []); // 빈 배열 []: 컴포넌트가 처음 렌더링될 때만 실행

  // 3. 조건부 렌더링 (로딩, 에러, 데이터 없음)
  if (isLoading) {
    return (
      <div className="mypage-content-box">
        <h2>설문 내역</h2>
        <p>설문 내역을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-content-box">
        <h2>설문 내역</h2>
        <p style={{ color: 'red' }}>데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  // 데이터가 성공적으로 로드되었을 때의 렌더링
  return (
    <div className="mypage-content-box">
      <h2>설문 내역</h2>

      {surveyData && surveyData.length > 0 ? (
        // 4. 설문 내역 테이블 렌더링
        <table className="survey-history-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>설문 제목</th>
              <th>참여 일자</th>
              <th>상세 보기</th>
            </tr>
          </thead>
          <tbody>
            {surveyData.map((survey, index) => (
              <tr key={survey.id}>
                <td>{index + 1}</td>
                <td>{survey.title}</td>
                <td>{survey.dateCompleted}</td>
                <td>
                  {/* 상세 페이지로 이동하는 링크나 버튼 추가 */}
                  <button onClick={() => alert(`설문 ID: ${survey.id} 상세 정보 조회`)}>
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // 데이터가 없을 경우
        <p>참여한 설문 내역이 없습니다.</p>
      )}
    </div>
  );
}

export default SurveyHistory;