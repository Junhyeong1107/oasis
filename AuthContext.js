import React, { createContext, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native"; // 네비게이션 훅 추가

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const handleLoggedin = (email) => {
    // 로그인 처리 로직
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserPoints(userPoints);
  };

  const handleUserPoint = () => {
    setUserPoints((x) => x + 10);
  };

  const handleUserPoint_reset = () => {
    setUserPoints(0);
  };

  const handleLoggedout = () => {
    // 로그아웃 처리 로직
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserPoints(0);
  };

  const handleLoginScreenPress = () => {
    // 로그인 화면으로 이동하는 로직
    // 네비게이션 객체를 사용하여 화면 이동을 구현
    navigation.navigate("Login"); // 'Login'은 로그인 화면의 이름으로 변경해야 합니다.
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        handleLoggedin,
        handleLoggedout,
        handleLoginScreenPress,
        userPoints,
        handleUserPoint,
        handleUserPoint_reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
