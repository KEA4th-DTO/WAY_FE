import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import FullLayout from "../layouts/FullLayout";

// 인증 상태를 체크하는 함수 (예제)
const isAuthenticated = () => {
  // 실제 인증 로직을 여기에 작성
  return localStorage.getItem("accessToken") !== null;
};

const PrivateRoute = () => {
  return isAuthenticated() ? (
    <FullLayout>
      <Outlet />
    </FullLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
