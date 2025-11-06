import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn = false, userName = "회원", onLogout = () => console.log('로그아웃 기능 호출') }) => {
    return (
        <nav className="navbar">
            {/* 로고 */}
            <div className="nav-logo">
                <Link to="/">K-Digital Smart App</Link>
            </div>

            {/* 중앙 메뉴 */}
            <div className="nav-links">
                <Link to="/savings">적금소개</Link>
                <Link to="/survey">설문조사</Link>
                <Link to="/branches">카테고리</Link>
            </div>

            {/* 우측 인증 영역 */}
            <div className="nav-auth">
                {isLoggedIn ? (
                    <>
                        <span className="welcome-message">{userName}님 환영합니다!</span>
                        <Link to="/mypage" className="mypage-link">마이페이지</Link>
                        <button onClick={onLogout}>로그아웃</button>
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
