import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from 'framer-motion';

// --- 애니메이션 설정 ---
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
};
const pageTransition = { type: "spring", stiffness: 100, damping: 15, duration: 0.3 };

// --- 스타일 정의 (AI 답변 글씨 진하게, 가독성 최적화) ---
const styles = {
    // 💡 전체 컨테이너: 부드러운 배경, 중앙 정렬
    chatContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(145deg, #f0f4f9 0%, #e8ecf4 100%)",
        padding: "20px",
        fontFamily: 'Inter, Nanum Gothic, sans-serif',
        boxSizing: 'border-box',
    },
    // 💡 제목: 강조 및 디자인 통일
    title: {
        fontSize: "28px",
        marginBottom: "30px",
        color: "#1a3a60", // 딥 블루 계열
        fontWeight: "800",
        letterSpacing: "0.5px",
        display: 'flex',
        alignItems: 'center',
    },
    // 💡 채팅 박스: 깔끔한 흰색 카드, 깊은 그림자
    chatBox: {
        width: "95%",
        maxWidth: "800px",
        flex: 1, // 남은 공간 채우기
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "20px",
        overflowY: "auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginBottom: '20px',
        border: '1px solid #e0e6f1',
    },
    // 💡 메시지 기본 스타일
    message: {
        padding: "14px 18px",
        borderRadius: "20px",
        maxWidth: "85%",
        lineHeight: "1.6",
        fontSize: "15px",
        wordBreak: 'break-word',
        transition: 'all 0.3s ease',
    },
    // 💡 사용자 메시지: 브랜드 색상, 우측 정렬
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#2e6da4", // 차분한 금융 블루
        color: "white",
        borderBottomRightRadius: "4px", // 꼬리 효과
    },
    // 💡 봇 메시지: 배경과 글씨색/굵기 수정 (가장 진하고 선명하게)
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#eaf3ff", // 매우 연한 블루/그레이
        color: "#121212", // 거의 검은색으로 변경 (가장 진하게)
        borderBottomLeftRadius: "4px", // 꼬리 효과
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        borderLeft: '4px solid #0070c9', // 답변의 중요성 강조
        fontFamily: 'Nanum Gothic, Inter, sans-serif', // 가독성 좋은 폰트
        fontWeight: '600', // 굵기 600으로 변경하여 더욱 진하고 선명하게
    },
    // 💡 입력 영역: 통일된 디자인
    inputArea: {
        display: "flex",
        width: "95%",
        maxWidth: "800px",
        marginBottom: "20px",
    },
    // 💡 입력 필드: 깔끔한 디자인
    input: {
        flex: 1,
        padding: "16px",
        borderRadius: "10px 0 0 10px",
        border: "1px solid #c8d0da",
        borderRight: "none",
        outline: "none",
        fontSize: "16px",
        transition: "border-color 0.3s",
    },
    // 💡 전송 버튼: 메인 색상, 애니메이션 효과
    sendBtn: {
        backgroundColor: "#0070c9", // 주요 금융 색상 (파랑)
        color: "white",
        padding: "16px 30px",
        borderRadius: "0 10px 10px 0",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "background-color 0.3s, transform 0.1s",
    },
    sendBtnHover: {
        backgroundColor: "#005a9e",
    },
    loadingIndicator: {
        alignSelf: 'flex-start',
        color: '#666',
        fontSize: '14px',
        fontStyle: 'italic',
        padding: '10px 20px',
    },
    errorIndicator: {
        color: '#d32f2f',
        backgroundColor: '#ffcdd2',
        border: '1px solid #d32f2f',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: '500',
        alignSelf: 'flex-start',
    }
};

// --- 메인 컴포넌트 ---
const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요 😊 금융 상담 AI입니다. 무엇을 도와드릴까요? (예: 적금 상품 추천해줘)" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const chatBoxRef = useRef(null);

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const currentMessage = inputValue;
    const userMessage = { sender: "user", text: currentMessage };

    // 1. 사용자 메시지 추가 및 입력창 비우기
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId") || "test_user_001";

      const res = await axios.post("http://localhost:8080/api/chat", {
        userId,
        message: currentMessage,
      });

      const replyText = typeof res.data === "object" && res.data.content ? res.data.content : res.data;
      const botMessage = { sender: "bot", text: replyText };

      // 3. AI 응답 메시지 추가
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error("API Error:", err);
      // 4. 오류 메시지 메시지 추가
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ 서버 연결 오류 또는 응답 오류입니다. 백엔드 서버가 8080 포트에서 실행 중인지, OPENAI_API_KEY가 올바른지 확인해주세요.", isError: true },
      ]);
    } finally {
        setLoading(false);
    }
  };

  // 버튼 스타일 동적 결정 (호버 효과)
  const sendButtonStyles = {
    ...styles.sendBtn,
    ...(isHovering ? styles.sendBtnHover : {}),
    opacity: loading ? 0.7 : 1,
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  return (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={styles.chatContainer}
    >
      <h2 style={styles.title}>
        <svg fill="#1a3a60" width="24" height="24" viewBox="0 0 24 24" style={{marginRight: '10px', transform: 'translateY(-2px)'}}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        금융 AI 상담 챗봇
      </h2>

      <div id="chat-box" ref={chatBoxRef} style={styles.chatBox}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            style={{
              ...styles.message,
              ...(msg.sender === "user" ? styles.userMessage : styles.botMessage),
              ...(msg.isError ? styles.errorIndicator : {}),
            }}
          >
            {/* 💡 AI 답변 (bot)의 글씨를 이쁘게 꾸미는 로직: 줄 바꿈과 볼드체 처리 */}
            {msg.sender === "bot" ? (
                msg.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {/* 간단한 **볼드체** 감지 및 <strong> 태그 변환 */}
                        {line.split(/(\*\*.*?\*\*)/g).map((part, pIndex) =>
                          part.startsWith('**') && part.endsWith('**') ?
                          <strong key={pIndex}>{part.slice(2, -2)}</strong> :
                          part
                        )}
                        {index < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ))
            ) : (
                msg.text
            )}
          </motion.div>
        ))}
        {loading && (
            <div style={styles.loadingIndicator}>
                AI가 답변을 생성 중입니다...
                <span className="typing-indicator" style={{marginLeft: '5px'}}>...</span>
            </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          placeholder={loading ? "답변을 기다리는 중..." : "금융 관련 질문을 입력하세요..."}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
          style={styles.input}
        />
        <button
            onClick={handleSend}
            style={sendButtonStyles}
            disabled={loading}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
          {loading ? '전송 중' : '전송'}
        </button>
      </div>

      {/* 기본 CSS로 폰트 임포트 및 볼드체/타이핑 인디케이터 설정 */}
      <style>{`
        /* AI 답변 글씨체 설정 (Nanum Gothic 폰트 임포트) */
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;600;700&display=swap');

        /* <strong> 태그를 위한 CSS: AI 답변 내 강조 글씨를 확실하게 굵게 표시 */
        strong {
            font-weight: 700 !important;
            color: #000000 !important; /* 강조된 글씨는 완벽한 검은색으로 */
        }

        @keyframes blink {
            50% { opacity: 0; }
        }
        .typing-indicator {
            animation: blink 1s infinite;
        }

        /* 모바일 최적화 */
        @media (max-width: 600px) {
            .chat-container {
                padding: 10px;
            }
            .title {
                font-size: 24px;
                margin-bottom: 20px;
            }
            .chat-box {
                padding: 15px;
            }
            .message {
                font-size: 14px;
                padding: 10px 14px;
            }
            .input {
                padding: 12px;
            }
            .send-btn {
                padding: 12px 20px;
            }
        }
      `}</style>
    </motion.div>
  );
};

export default ChatPage;