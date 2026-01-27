import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.css';

// useNavigate를 사용하여 로그인되지 않은 경우 리디렉션을 구현할 수 있습니다.
//import { useNavigate } from 'react-router-dom';

function MyPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const navigate = useNavigate(); // 리디렉션이 필요할 경우 사용

    useEffect(() => {
        // 🔑 인증 토큰을 저장소에서 가져옵니다. (예: localStorage)
        // 실제 구현 시 토큰 이름(예: accessToken)으로 변경해야 합니다.
        const token = localStorage.getItem('jwtToken');

        // 토큰이 없으면 즉시 에러 처리
        if (!token) {
            setError("로그인이 필요합니다. (토큰 없음)");
            setLoading(false);
            // navigate('/login'); // 리디렉션 로직 활성화
            return;
        }

        // 💡 API 호출 시 Authorization 헤더에 토큰을 수동으로 추가합니다.
        // [주의] '/api/mypage' 경로는 백엔드 Controller와 일치해야 합니다.
        axios.get('/api/mypage', {
            headers: {
                // 토큰 타입과 토큰 값을 "Bearer 토큰값" 형태로 전송합니다.
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setUserInfo(response.data);
            setLoading(false);
        })
        .catch(err => {
            // 401 Unauthorized 에러 처리 예시
            if (err.response && err.response.status === 401) {
                setError("인증되지 않은 사용자입니다. 세션이 만료되었습니다. (로그인 페이지로 이동합니다.)");
                // navigate('/login'); // 실제 구현 시 로그인 페이지로 리디렉션
            } else {
                // 기타 서버 오류 (5xx), 권한 오류 (403), 경로 오류 (404) 등을 포함
                setError("사용자 정보를 불러오는 데 실패했습니다. 서버 로그 및 네트워크 탭을 확인하세요.");
            }
            setLoading(false);
            console.error("MyPage API Error:", err.response ? err.response.data : err.message);
        });
    }, []);

    /** 날짜 포맷팅 함수 (YYYY년 MM월 DD일) */
    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    /** 금액을 천 단위 쉼표와 '원'으로 포맷팅 */
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '정보 없음';
        return amount.toLocaleString('ko-KR') + ' 원';
    };

    // --- 로딩 및 에러 상태 처리 ---
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>정보를 불러오는 중입니다...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>⚠️ 오류: {error}</div>;

    // --- 데이터 표시 ---
    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
            <h2>👋 {userInfo.name}님의 마이페이지</h2>
            <hr/>
            <div style={{ lineHeight: '2.0' }}>
                <p><strong>아이디:</strong> {userInfo.userId}</p>
                <p><strong>이름:</strong> {userInfo.name}</p>

                {/* 연소득 (income) 표시 및 포맷팅 */}
                <p>
                    <strong>연소득:</strong>
                    <span style={{ fontWeight: 'bold', color: '#10B981', marginLeft: '10px' }}>
                        {formatCurrency(userInfo.income)}
                    </span>
                </p>

                {/* 가입일 (createdAt) 표시 및 포맷팅 */}
                <p><strong>가입일:</strong> {formatDate(userInfo.createdAt)}</p>

                {/* 권한/등급 (role) 표시 */}
                <p><strong>권한/등급:</strong>
                    <span style={{ fontWeight: 'bold', color: userInfo.role === 'ADMIN' ? 'blue' : '#575757', marginLeft: '10px' }}>
                        {userInfo.role}
                    </span>
                </p>
            </div>

            <hr/>
            <h3>나의 활동 및 설정</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ marginBottom: '8px' }}>➡️ <a href="/survey-history">설문 참여 내역 조회</a></li>
                <li style={{ marginBottom: '8px' }}>➡️ <a href="/edit-info">개인 정보 수정</a></li>
                <li>➡️ <a href="/change-password">비밀번호 변경</a></li>
            </ul>
        </div>
    );
}

export default MyPage;