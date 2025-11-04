import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const BankMap = () => {
  const mapRef = useRef(null);
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  const regions = ["전체", "기흥구", "처인구", "수지구"];
  const bankBrands = ["전체", "KB국민은행", "신한은행", "우리은행", "IBK기업은행", "하나은행"];

  // ✅ 은행 이름만 추출하는 함수
  const extractBrand = (name) => {
    const brands = ["KB국민은행", "신한은행", "우리은행", "IBK기업은행", "하나은행"];
    for (let b of brands) {
      if (name.includes(b)) return b;
    }
    return "기타";
  };

  // ✅ 1. 지점 데이터 로드
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/branches");
        setBranches(response.data);
        setFilteredBranches(response.data);
      } catch (error) {
        console.error("❌ 지점 정보를 불러오지 못했습니다:", error);
      }
    };
    fetchBranches();
  }, []);

  // ✅ 2. 카카오맵 로드
  useEffect(() => {
    if (!kakaoKey) return;
    const existing = document.querySelector("script[data-kakao-sdk]");
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
      script.async = true;
      script.setAttribute("data-kakao-sdk", "true");
      document.head.appendChild(script);
      script.onload = () => window.kakao.maps.load(initMap);
    } else {
      window.kakao?.maps?.load(initMap);
    }

    function initMap() {
      if (!mapRef.current) return;
      const center = new window.kakao.maps.LatLng(37.274, 127.118);
      const createdMap = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 6,
      });
      setMap(createdMap);
    }
  }, [kakaoKey]);

  // ✅ 3. 마커 렌더링
  useEffect(() => {
    if (map && filteredBranches.length > 0) {
      renderMarkers(map, filteredBranches);
    }
  }, [filteredBranches, map]);

  function renderMarkers(map, list) {
    const kakao = window.kakao;
    if (!kakao || !map) return;

    if (map.markers) map.markers.forEach((m) => m.setMap(null));

    let openInfoWindow = null;

    const markers = list.map((b) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(b.latitude, b.longitude),
        title: b.bankName,
      });
      marker.setMap(map);

      const info = new kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;font-size:13px;line-height:1.5;color:#333;">
            <b style="color:#005bac;">🏦 ${b.bankName}</b><br/>
            ${b.address}
          </div>`,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        if (openInfoWindow === info) {
          info.close();
          openInfoWindow = null;
        } else {
          if (openInfoWindow) openInfoWindow.close();
          info.open(map, marker);
          openInfoWindow = info;
        }
      });

      return marker;
    });

    map.markers = markers;

    const bounds = new kakao.maps.LatLngBounds();
    list.forEach((b) =>
      bounds.extend(new kakao.maps.LatLng(b.latitude, b.longitude))
    );
    map.setBounds(bounds);
  }

  // ✅ 4. 내 위치 찾기
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ 현재 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const locPosition = new kakao.maps.LatLng(latitude, longitude);

        geocoder.coord2Address(
          locPosition.getLng(),
          locPosition.getLat(),
          (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;

              const marker = new kakao.maps.CustomOverlay({
                position: locPosition,
                content: `
                  <div style="
                    width:14px;
                    height:14px;
                    background-color:#1976d2;
                    border:2px solid white;
                    border-radius:50%;
                    box-shadow:0 0 10px rgba(25,118,210,0.6);
                  "></div>
                `,
                yAnchor: 0.5,
              });
              marker.setMap(map);

              const info = new kakao.maps.CustomOverlay({
                position: locPosition,
                content: `
                  <div style="
                    background:white;
                    border-radius:8px;
                    padding:8px 12px;
                    font-size:13px;
                    font-weight:500;
                    color:#333;
                    box-shadow:0 2px 8px rgba(0,0,0,0.15);
                    border:1px solid #ddd;
                    transform:translateY(-30px);
                  ">
                    📍 현재 위치<br/>${address}
                  </div>
                `,
                yAnchor: 1,
              });
              info.setMap(map);

              map.panTo(locPosition);
            }
          }
        );
      },
      (error) => {
        console.error(error);
        alert("🚫 위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.");
      }
    );
  };

  // ✅ 5. 지역 + 브랜드 필터링
  useEffect(() => {
    let filtered = branches;

    if (selectedRegion !== "전체") {
      filtered = filtered.filter(
        (b) =>
          b.address &&
          (b.address.includes(selectedRegion) ||
            (selectedRegion === "수지구" && b.address.includes("수지")) ||
            (selectedRegion === "기흥구" && b.address.includes("기흥")) ||
            (selectedRegion === "처인구" && b.address.includes("처인")))
      );
    }

    if (selectedBrand !== "전체") {
      filtered = filtered.filter(
        (b) => extractBrand(b.bankName) === selectedBrand
      );
    }

    setFilteredBranches(filtered);
  }, [branches, selectedRegion, selectedBrand]);

  return (
    <div
      style={{
        backgroundColor: "#f7f8fa",
        minHeight: "100vh",
        padding: "50px 0",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #0047AB 0%, #1976d2 100%)",
            color: "white",
            padding: "30px 0",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: "700" }}>
            용인시 은행 지점 안내
          </h1>
          <p style={{ marginTop: "10px", opacity: "0.9" }}>
            지역과 은행을 선택해 가까운 지점을 찾아보세요
          </p>
        </div>

        {/* ✅ 지역 필터 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                backgroundColor:
                  selectedRegion === region ? "#1976d2" : "#f0f0f0",
                color: selectedRegion === region ? "white" : "#333",
                border: "none",
                borderRadius: "25px",
                padding: "10px 25px",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow:
                  selectedRegion === region
                    ? "0 4px 10px rgba(25,118,210,0.3)"
                    : "none",
              }}
            >
              {region}
            </button>
          ))}
        </div>

        {/* ✅ 브랜드 필터 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "15px",
            flexWrap: "wrap",
          }}
        >
          {bankBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              style={{
                backgroundColor:
                  selectedBrand === brand ? "#ff9800" : "#f0f0f0",
                color: selectedBrand === brand ? "white" : "#333",
                border: "none",
                borderRadius: "25px",
                padding: "8px 18px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow:
                  selectedBrand === brand
                    ? "0 4px 10px rgba(255,152,0,0.3)"
                    : "none",
              }}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* ✅ 내 근처 찾기 버튼 */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            onClick={handleFindMyLocation}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "10px 25px",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 10px rgba(76,175,80,0.3)",
            }}
          >
            📍 내 근처 지점 찾기
          </button>
        </div>

        {/* ✅ 지도 */}
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "600px",
            marginTop: "25px",
            borderRadius: "16px",
          }}
        />

        {/* ✅ 지점 개수 표시 */}
        <div
          style={{
            textAlign: "center",
            padding: "15px 0 30px",
            color: "#555",
            fontSize: "15px",
          }}
        >
          표시 중인 지점 수:{" "}
          <b style={{ color: "#1976d2" }}>{filteredBranches.length}</b>개
        </div>
      </div>
    </div>
  );
};

export default BankMap;
