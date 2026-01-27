import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 챗봇 아이콘 SVG (혹은 폰트어썸 등 사용 가능)
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="28px"
    height="28px"
    style={{ display: 'block' }}
  >
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const FloatingChatButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chat'); // 챗봇 페이지 경로
  };

  return (
    <motion.button
      onClick={handleClick}
      // 애니메이션 효과 (버튼이 살짝 떴다가 내려오는 듯한 느낌)
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',    // 화면에 고정
        bottom: '30px',       // 하단에서 30px 위
        right: '30px',        // 우측에서 30px 안쪽
        width: '60px',        // 버튼 너비
        height: '60px',       // 버튼 높이
        borderRadius: '50%',  // 원형 버튼
        backgroundColor: '#007bff', // 토스 컬러 또는 원하는 색상
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)', // 그림자 효과
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        zIndex: 1000,         // 다른 요소 위에 표시
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
      aria-label="챗봇 고객센터 열기"
    >
      <ChatIcon />
    </motion.button>
  );
};

export default FloatingChatButton;