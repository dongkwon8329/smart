import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion'; // 💡 애니메이션 적용을 위한 import
import './SavingList.css';

// 💡 애니메이션 설정 (App.js와 동일한 variants를 사용한다고 가정)
const pageVariants = { initial: { opacity: 0, x: 50 }, in: { opacity: 1, x: 0 }, out: { opacity: 0, x: -50 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };


const SavingList = () => {
  const navigate = useNavigate();
  const [savings, setSavings] = useState([]);
  const [filters, setFilters] = useState({
    bankName: '',
    minRate: '',
    maxPeriod: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true); // ⬅️ [추가] 로딩 상태

  useEffect(() => {
    setLoading(true); // API 호출 시작 시 로딩 true
    axios
      .get('/api/savings', { params: { ...filters, sortBy } })
      .then((res) => setSavings(res.data))
      .catch((err) => console.error('API 오류:', err))
      .finally(() => setLoading(false)); // API 호출 완료 시 로딩 false
  }, [filters, sortBy]);

  // --- 렌더링 부분 ---

  // 1. 로딩 중 표시
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-message" style={{textAlign: 'center', padding: '50px'}}>
          상품 정보를 불러오는 중...
        </div>
      );
    }

    // 2. 데이터 없음 표시
    if (savings.length === 0) {
      return (
        <div className="no-results" style={{textAlign: 'center', padding: '50px', color: '#888'}}>
          😭 현재 조건에 맞는 적금 상품이 없습니다.
        </div>
      );
    }

    // 3. 상품 목록 렌더링
    return (
      <section className="saving-list">
        {savings.map((s) => (
          <div key={s.id} className="saving-card">
            <div className="card-top">
              <h3>{s.bankName}</h3>
              <span className="tag">{s.period}개월</span>
            </div>
            <h2 className="product-name">{s.productName}</h2>
            <div className="rate-info">
              <strong>{s.interestRate}%</strong>
              {s.maxInterestRate && (
                <span className="max-rate">최대 {s.maxInterestRate}%</span>
              )}
            </div>
            <p className="condition">{s.condition}</p>

            <button
              className="detail-btn"
              onClick={() => navigate(`/savings/${s.id}`)}
            >
              상품 자세히 보기 →
            </button>
          </div>
        ))}
      </section>
    );
  };

  return (
    // 💡 [핵심] motion.div를 사용하여 페이지 전환 애니메이션 적용
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="saving-page"
    >
      <header className="saving-header">
        <h1>💰 적금 상품 소개</h1>
        <p className="sub-text">당신에게 맞는 최적의 적금 상품을 찾아보세요</p>
      </header>

      <section className="filter-bar">
        <input
          type="text"
          placeholder="은행명 검색"
          onChange={(e) => setFilters({ ...filters, bankName: e.target.value })}
        />
        <input
          type="number"
          placeholder="최소 금리"
          onChange={(e) => setFilters({ ...filters, minRate: e.target.value })}
        />
        <input
          type="number"
          placeholder="최대 기간(개월)"
          onChange={(e) => setFilters({ ...filters, maxPeriod: e.target.value })}
        />
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="">정렬 없음</option>
          <option value="rate">금리 높은 순</option>
          <option value="period">기간 짧은 순</option>
        </select>
      </section>

      {renderContent()} {/* ⬅️ 로딩/목록 렌더링 함수 호출 */}
    </motion.div>
  );
};

export default SavingList;