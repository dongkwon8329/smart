import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyPageLayout.css'; // 공통 스타일 재사용

function ProfileEdit() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        income: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // 1. 초기 정보 로드 (내 정보 조회 API 재활용)
    useEffect(() => {
        const fetchInitialInfo = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                const response = await axios.get('/api/mypage', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data;

                // 💡 DTO의 필드를 formData에 설정
                setFormData({
                    name: userData.name || '',
                    phoneNumber: userData.phoneNumber || '',
                    income: userData.income || 0,
                    // userId는 수정 불가이므로 상태로 저장하지 않음
                });
            } catch (err) {
                setError('초기 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialInfo();
    }, []);

    // 2. 입력 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'income' ? Number(value.replace(/,/g, '')) : value // 연소득 콤마 제거 후 숫자로 변환
        }));
    };

    // 3. 폼 제출 (정보 수정 API 호출)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('jwtToken');

        // 💡 연소득이 숫자인지 확인하는 등 추가 유효성 검사 필요

        try {
            await axios.put('/api/mypage/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ 정보가 성공적으로 수정되었습니다.');
            navigate('/mypage/info'); // 수정 후 내 정보 페이지로 이동
        } catch (err) {
            console.error('정보 수정 실패:', err);
            alert('❌ 정보 수정에 실패했습니다: ' + (err.response?.data || '서버 오류'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="mypage-content-box">정보를 불러오는 중입니다...</div>;

    return (
        <div className="mypage-content-box profile-edit-box">
            <h2 className="content-title">개인 정보 수정</h2>
            {error && <p className="form-error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="profile-edit-form">

                {/* 이름 입력 필드 */}
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 전화번호 입력 필드 */}
                <div className="form-group">
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 연소득 입력 필드 */}
                <div className="form-group">
                    <label htmlFor="income">연소득 (원)</label>
                    <input
                        type="number" // 숫자로 입력 받음
                        id="income"
                        name="income"
                        value={formData.income}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                {/* 폼 제출 버튼 */}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '수정 중...' : '정보 저장'}
                </button>
            </form>
        </div>
    );
}

export default ProfileEdit;