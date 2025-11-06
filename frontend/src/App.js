// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BankMap from './components/BankMap.js';
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className="content-padding">
        <Routes>
        <Route path="/branches" element={<BankMap />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* {isLoggedIn && <Route path="/mypage" element={<MyPage />} />} */}
        </Routes>
      </div>
    </>
  );
}

export default App;
