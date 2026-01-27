// src/components/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // 1. localStorage에서 권한 정보와 토큰을 가져옵니다.
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('jwtToken');

    // 2. 관리자 권한 확인 (토큰이 있고, 역할이 'ADMIN'인지)
    const isAdmin = authToken && userRole === 'ADMIN';

    // 3. 조건에 따라 처리
    if (isAdmin) {
        // 관리자라면, 요청한 하위 라우트(AdminMainPage)를 렌더링합니다.
        return <Outlet />;
    } else if (authToken) {
        // 로그인했지만 관리자가 아니라면 (일반 USER), 접근 거부 메시지 표시 후 메인으로 이동
        alert('관리자 권한이 필요합니다. 접근할 수 없습니다.');
        return <Navigate to="/" replace />;
    } else {
        // 아예 로그인이 안 되어 있다면 로그인 페이지로 이동
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;