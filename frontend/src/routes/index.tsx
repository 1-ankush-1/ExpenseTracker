import { Route, Routes } from "react-router-dom";
import UserRoutes from "./user";
import AdminRoutes from "./admin";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
  );
};

export default AppRoutes;
