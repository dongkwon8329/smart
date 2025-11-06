// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import './SignupPage.css'; // 스타일 임포트

const SignupPage = () => {
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        password: '',
        confirmPassword: '', // DB에 없지만 사용자 경험을 위해 추가
        age: '',
        income: '',
        goal_amount: ''
    });

    // 💡 백엔드 API 기본 URL 설정
    const API_BASE_URL = 'http://localhost:8080/api/users';
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => { // 비동기 함수로 변경
        e.preventDefault();

        // 1. 필수 필드 검사 (password, name)
        if (!formData.name || !formData.password || !formData.confirmPassword) {
            alert("이름과 비밀번호는 필수 입력 항목입니다.");
            return;
        }

        // 2. 비밀번호 일치 검사
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        // 3. 실제 DB에 보낼 데이터 (confirmPassword 제외)
        const dataToSend = {
            userId: formData.userId,
            name: formData.name,
            password: formData.password,
            // 숫자가 아닌 경우 null을 보내도록 처리
            age: parseInt(formData.age) || null,
            income: parseFloat(formData.income) || null,
            goalAmount: parseFloat(formData.goal_amount) || null, // Java DTO 필드명에 맞춤
        };

        // 4. 백엔드 API 호출 로직
        try {

            const response = await fetch("http://localhost:8080/api/users/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });


            if (response.ok) {
                alert("✅ 회원가입이 성공적으로 완료되었습니다! 이제 로그인해 주세요.");
                navigate('/login'); // 성공 후 로그인 페이지로 이동
            } else {
                const errorText = await response.text(); // String 형태의 에러 메시지 수신
                alert(`❌ 회원가입 실패: ${errorText || response.statusText}`);
            }
        } catch (error) {
            console.error("회원가입 중 네트워크 오류 발생:", error);
            alert("네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>회원가입</h2>
                <p className="required-info">* 이름과 비밀번호는 필수 항목입니다.</p>

                <form onSubmit={handleSubmit}>

                    {/* 0. 아이디 (userId) - 필수 */}
                        <div className="form-group">
                            <label htmlFor="userId">아이디 *</label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    {/* 1. 이름 (name) - 필수 */}
                    <div className="form-group">
                        <label htmlFor="name">이름 *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* 2. 비밀번호 (password) - 필수 */}
                    <div className="form-group">
                        <label htmlFor="password">비밀번호 *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* 3. 비밀번호 확인 (confirmPassword) - 필수 */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">비밀번호 확인 *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* 4. 나이 (age) */}
                    <div className="form-group">
                        <label htmlFor="age">나이</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="0"
                            max="150"
                        />
                    </div>

                    {/* 5. 연소득 (income) */}
                    <div className="form-group">
                        <label htmlFor="income">연소득 (원)</label>
                        <input
                            type="number"
                            id="income"
                            name="income"
                            value={formData.income}
                            onChange={handleChange}
                            step="10000"
                        />
                    </div>

                    {/* 6. 목표 금액 (goal_amount) */}
                    <div className="form-group">
                        <label htmlFor="goal_amount">목표 저축 금액 (원)</label>
                        <input
                            type="number"
                            id="goal_amount"
                            name="goal_amount"
                            value={formData.goal_amount}
                            onChange={handleChange}
                            step="10000"
                        />
                    </div>

                    <button type="submit" className="signup-button">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;