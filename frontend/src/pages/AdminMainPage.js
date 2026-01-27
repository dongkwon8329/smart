import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminMainPage.css';

const AdminMainPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // JWT 토큰과 헤더 설정 (useCallback 밖에서 선언)
    const token = localStorage.getItem('jwtToken');

    // 🔑 [함수 구현] 회원 목록을 백엔드에서 불러오는 함수
    const fetchUsers = useCallback(async () => {

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        if (!token) {
            setError('오류: 인증 토큰이 없습니다. 다시 로그인해주세요.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('/api/admin/users', config);
            setUsers(response.data);
        } catch (err) {
            console.error('회원 목록 로딩 실패:', err);
            setError('회원 목록 조회 중 오류가 발생했습니다. 권한 및 서버 상태를 확인하세요.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    // 🔑 [실제 구현] 회원 삭제 기능 (DELETE)
    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`[경고] ${userName} (${userId}) 회원을 정말로 영구 삭제하시겠습니까?`)) {
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.delete(`/api/admin/users/${userId}`, config);
            alert(`${userName} 회원이 성공적으로 삭제되었습니다.`);
            fetchUsers(); // 목록 새로고침
        } catch (error) {
            console.error('회원 삭제 실패:', error);
            alert('회원 삭제 중 오류가 발생했습니다. 권한을 확인하세요.');
        }
    };

    // 🔑 [실제 구현] 회원 정보 수정 기능 (PUT - 역할만 토글)
    const handleUpdate = async (user) => {
        // 현재 ROLE의 반대 ROLE을 설정
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

        if (!window.confirm(`${user.name}의 권한을 [${newRole}]로 변경하시겠습니까?`)) {
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.put(`/api/admin/users/${user.userId}`, {
                role: newRole,
            }, config);

            alert(`${user.name}의 권한이 ${newRole}로 변경되었습니다.`);
            fetchUsers(); // 목록 새로고침
        } catch (error) {
            console.error('회원 수정 실패:', error);
            alert('회원 수정 중 오류가 발생했습니다. 권한을 확인하세요.');
        }
    };


    if (loading) return <div className="admin-main-page-container">회원 목록 로딩 중...</div>;
    if (error) return <div className="admin-main-page-container text-red-600">오류: {error}</div>;

    return (
        <div className="admin-main-page-container">
            <h1>회원 관리 대시보드</h1>

            <div className="admin-card">
                <h2>전체 회원 목록 ({users.length}명)</h2>

                {users.length === 0 ? (
                    <p>등록된 회원이 없습니다.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>이름</th>
                                <th>나이</th>
                                <th>권한</th>
                                <th>가입일</th>
                                <th style={{textAlign: 'center'}}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.name}</td>
                                    <td>{user.age}</td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'ADMIN' ? 'admin' : 'user'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="action-buttons">
                                        <button
                                            onClick={() => handleUpdate(user)}
                                            className="edit-btn"
                                        >
                                            권한 수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.userId, user.name)}
                                            className="delete-btn"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminMainPage;