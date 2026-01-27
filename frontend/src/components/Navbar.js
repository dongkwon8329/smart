import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Navbar 컴포넌트가 이제 props 없이 localStorage만 참조합니다.
const Navbar = () => {

    // 🔑 [핵심] localStorage에서 모든 정보와 권한을 직접 가져옵니다.
    const jwtToken = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const isUserLoggedIn = !!jwtToken;

    // 🔑 [관리자 권한 확인] ADMIN이 아니면 false
    const isAdmin = isUserLoggedIn && userRole === 'ADMIN';

    const finalUserName = userId || "회원";

    const handleLogout = () => {
        // localStorage 정리
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');

        // 페이지 새로고침
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            {/* 로고 */}
            <div className="nav-logo">
                <Link to="/">K-Digital Smart App</Link>
            </div>

            {/* 중앙 메뉴 */}
            <div className="nav-links">
                {/* 🔑 [핵심] 관리자 권한이 있을 때만 '회원 관리' 메뉴 표시 */}
                {isAdmin && (
                    <Link to="/admin" className="admin-link" style={{ fontWeight: 'bold', color: '#10B981' }}>
                        회원 관리
                    </Link>
                )}

                <Link to="/about">홈페이지 소개</Link>
                <Link to="/chat">고객센터</Link>
                <Link to="/savings">적금소개</Link>
                <Link to="/survey">설문조사</Link>
                <Link to="/branches">카테고리</Link>
            </div>

            {/* 우측 인증 영역 */}
            <div className="nav-auth">
                {isUserLoggedIn ? (
                    <>
                        <span className="welcome-message">{isAdmin ? "관리자님" : finalUserName} 환영합니다!</span>
                        <Link to="/mypage" className="mypage-link">마이페이지</Link>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;