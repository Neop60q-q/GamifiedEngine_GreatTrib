import { Outlet } from "react-router-dom";
import ManagementSidebar from "./components/ManagementSidebar";

export default function ManagementLayout() {
  return (
    <div className="management-layout">
      <ManagementSidebar />

      <div className="management-content">
        <Outlet />
      </div>
    </div>
  );
}