// src/pages/SavingAdminPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SavingAdminPage.css";

function SavingAdminPage() {
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    id: null,
    bankName: "",
    productName: "",
    interestRate: "",
    maxInterestRate: "",
    period: "",
    condition: "",
    linkUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  /** 🔹 목록 불러오기 */
  const loadList = () => {
    axios
      .get("/api/savings")
      .then((res) => setList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadList();
  }, []);

  /** 🔹 input 값 변경 */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** 🔹 등록 */
  const handleCreate = () => {
    axios
      .post("/api/savings", form)
      .then(() => {
        alert("등록 완료!");
        resetForm();
        loadList();
      })
      .catch((err) => console.error(err));
  };

  /** 🔹 수정 버튼 클릭 */
  const handleEditClick = (item) => {
    setForm(item);
    setIsEditing(true);
  };

  /** 🔹 수정 저장 */
  const handleUpdate = () => {
    axios
      .put(`/api/savings/${form.id}`, form)
      .then(() => {
        alert("수정 완료!");
        resetForm();
        setIsEditing(false);
        loadList();
      })
      .catch((err) => console.error(err));
  };

  /** 🔹 삭제 */
  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/savings/${id}`)
      .then(() => {
        alert("삭제 완료!");
        loadList();
      })
      .catch((err) => console.error(err));
  };

  /** 🔹 초기화 */
  const resetForm = () => {
    setForm({
      id: null,
      bankName: "",
      productName: "",
      interestRate: "",
      maxInterestRate: "",
      period: "",
      condition: "",
      linkUrl: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">관리자: 적금 상품 관리</h1>

      {/* 🔥 입력 폼 */}
      <div className="admin-form">
        <h2 className="form-title">
          {isEditing ? "상품 수정" : "신규 상품 등록"}
        </h2>

        {/* 1줄 - 6개 필드 */}
        <div className="form-row">
          <input name="bankName" placeholder="은행명" value={form.bankName} onChange={handleChange} />
          <input name="productName" placeholder="상품명" value={form.productName} onChange={handleChange} />
          <input name="interestRate" placeholder="기본 금리" value={form.interestRate} onChange={handleChange} />
          <input name="maxInterestRate" placeholder="최대 금리" value={form.maxInterestRate} onChange={handleChange} />
          <input name="period" placeholder="기간(개월)" value={form.period} onChange={handleChange} />
          <input name="condition" placeholder="조건" value={form.condition} onChange={handleChange} />
        </div>

        {/* 2줄 - URL 전체
        <div className="form-row-full">
          <input name="linkUrl" placeholder="링크 URL" value={form.linkUrl} onChange={handleChange} />
        </div>
        */}

        {/* 버튼 */}
        {isEditing ? (
          <div>
            <button className="submit-btn" onClick={handleUpdate}>수정 저장</button>
            <button className="cancel-btn" onClick={resetForm}>취소</button>
          </div>
        ) : (
          <button className="submit-btn" onClick={handleCreate}>등록</button>
        )}
      </div>

      {/* 🔥 목록 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>은행명</th>
              <th>상품명</th>
              <th>금리</th>
              <th>기간</th>
              <th>조건</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.bankName}</td>
                <td>{s.productName}</td>
                <td>{s.interestRate}% ~ {s.maxInterestRate}%</td>
                <td>{s.period}개월</td>
                <td>{s.condition}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(s)}>수정</button>
                  <button className="delete-btn" onClick={() => handleDelete(s.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SavingAdminPage;
