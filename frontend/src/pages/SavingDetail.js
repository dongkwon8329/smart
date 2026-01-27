import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ navigate 추가
import axios from "axios";
import "./SavingDetail.css"; // ✅ CSS 통합 (App.css 안에 스타일 적용)
                    // 만약 별도로 SavingDetail.css 유지하고 싶으면 "./SavingDetail.css"로 유지해도 OK

function SavingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/savings/${id}`)
      .then((res) => setSaving(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!saving) return <div className="loading">로딩 중...</div>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="bank-name">{saving.bankName}</h2>
        <h1 className="product-name">{saving.productName}</h1>
        <div className="rate-box">
          <span className="rate-main">{saving.interestRate}%</span>
          <span className="rate-sub">최대 {saving.maxInterestRate}%</span>
        </div>
        <p className="period">가입 기간: {saving.period}개월</p>
        <p className="condition">{saving.condition}</p>

        <div className="description">
          <p>
            이 상품은 고객의 금융 생활 패턴에 맞춘 맞춤형 적금으로, 금리 혜택과 편리한 자동이체 기능을 제공합니다.
          </p>
          <p>
            특히 {saving.bankName} 앱을 통해 손쉽게 관리할 수 있으며,
            꾸준한 납입을 통해 안정적으로 목돈을 모을 수 있습니다.
          </p>
        </div>

        {/* ✅ 공식페이지 대신 메인으로 돌아가기 버튼 */}
        <button
          onClick={() => navigate("/savings")}
          className="detail-link" // ✅ 기존 버튼 디자인 그대로 사용
        >
          ← 적금 상품 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SavingDetail;
