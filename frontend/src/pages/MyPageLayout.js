import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './MyPageLayout.css'; // 전용 CSS 파일 임포트

function MyPageLayout() {
    // 메뉴 항목 정의
    const menuItems = [
        { name: '내 정보', path: 'info' },       // /mypage/info
        { name: '설문 내역', path: 'surveys' },   // /mypage/surveys
        { name: '정보 수정', path: 'edit' },     // /mypage/edit
        // { name: 'FAQ', path: 'faq' },         // 필요시 추가
        // { name: '트레이너 등록', path: 'register-trainer' }, // 필요시 추가
    ];

    // NavLink는 현재 경로와 일치할 때 활성화된 스타일을 제공합니다.
    return (
        <div className="mypage-layout-container">
            <aside className="mypage-sidebar">
                <nav>
                    <ul className="mypage-menu-list">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                {/* NavLink를 사용하여 active 클래스 적용 */}
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? 'mypage-menu-item active' : 'mypage-menu-item'
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 하단 버튼 스타일 (정보수정 버튼과 유사하게) */}
                <div className="mypage-bottom-action">
                    <button className="mypage-info-button">정보 수정</button>
                </div>
            </aside>

            {/* 🔑 우측 콘텐츠 영역: 메뉴 클릭 시 내용이 여기에 표시됩니다. */}
            <main className="mypage-content-main">
                <Outlet />
            </main>
        </div>
    );
}

export default MyPageLayout;