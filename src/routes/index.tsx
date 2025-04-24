import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SandboxPage from "../pages/sandbox";

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<SandboxPage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
