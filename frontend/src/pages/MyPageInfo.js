import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyPageLayout.css'; // 레이아웃 스타일 재사용

// 💡 [임시] 사용자 프로필 사진 URL (실제로는 DB에서 가져와야 함)
const DEFAULT_PROFILE_IMAGE = 'https://i.imgur.com/8Q8W3xP.png';

function MyPageInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setError('토큰이 없습니다. 다시 로그인 해주세요.');
                setLoading(false);
                return;
            }

            try {
                // 💡 [주의] 백엔드에서 phoneNumber 필드가 없다면, income이나 다른 필드를 표시해야 합니다.
                const response = await axios.get('/api/mypage', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(response.data);
            } catch (err) {
                console.error('내 정보 불러오기 실패:', err);
                setError('사용자 정보를 불러오는 데 실패했습니다.');
                // 401, 403 에러 처리
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('세션이 만료되었습니다.');
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    // 금액 포맷팅 (연소득)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) return <div className="mypage-content-box">정보를 불러오는 중입니다...</div>;
    if (error) return <div className="mypage-content-box mypage-error">오류: {error}</div>;
    if (!userInfo) return <div className="mypage-content-box">사용자 정보를 찾을 수 없습니다.</div>;

    // 💡 백엔드 DTO에 phoneNumber 필드가 없으므로 임시 데이터 추가 (실제 DB 구조에 맞게 수정 필요)
    const displayPhoneNumber = userInfo.phoneNumber || '010-1234-5678 (미제공)';
    const displayProfileUrl = userInfo.profileImageUrl || DEFAULT_PROFILE_IMAGE;

    return (
        <div className="mypage-content-box">
            <h2 className="content-title">내 정보</h2>
            <div className="profile-info-grid">

                {/* 1. 프로필 사진 영역 */}
                <div className="profile-image-container">
                    <img src={displayProfileUrl} alt="프로필 사진" className="profile-image" />
                    <button
                        className="profile-edit-button"
                        onClick={() => navigate('/mypage/edit')}
                    >
                        프로필 수정
                    </button>
                </div>

                {/* 2. 상세 정보 영역 */}
                <div className="profile-details-list">
                    {/* 이름 */}
                    <div className="info-item">
                        <span className="info-label">이름</span>
                        <span className="info-value">{userInfo.name}</span>
                    </div>
                    {/* 아이디 */}
                    <div className="info-item">
                        <span className="info-label">아이디</span>
                        <span className="info-value">{userInfo.userId}</span>
                    </div>
                    {/* 전화번호 (임시 데이터 사용) */}
                    <div className="info-item">
                        <span className="info-label">전화번호</span>
                        <span className="info-value">{displayPhoneNumber}</span>
                    </div>
                    <hr className="info-divider" />
                    {/* 연소득 (이전에 추가됨) */}
                    <div className="info-item">
                        <span className="info-label">연소득</span>
                        <span className="info-value highlight-value">{formatCurrency(userInfo.income)}</span>
                    </div>
                    {/* 가입일 */}
                    <div className="info-item">
                        <span className="info-label">가입일</span>
                        <span className="info-value">{formatDate(userInfo.createdAt)}</span>
                    </div>
                    {/* 권한/등급 */}
                    <div className="info-item">
                        <span className="info-label">등급</span>
                        <span className="info-value">{userInfo.role}</span>
                    </div>
                </div>

            </div>

            {/* 하단 정보 수정 버튼 */}
            <div className="profile-action-footer">
                <button
                    className="full-width-edit-button"
                    onClick={() => navigate('/mypage/edit')}
                >
                    개인 정보 수정
                </button>
            </div>
        </div>
    );
}

export default MyPageInfo;