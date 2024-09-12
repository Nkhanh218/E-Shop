import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AdminMenu from "./AdminMenu"; // Ensure the path is correct
import AdminHeader from "./AdminHeader";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [headerTitle, setHeaderTitle] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return userInfo && userInfo.isAdmin ? (
    <div className=" flex flex-col md:flex-row ">
      <div className="">
        <AdminMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      </div>
      <div className="w-[100%]">
        <AdminHeader toggleCollapsed={toggleCollapsed} collapsed={collapsed} />
        <Outlet context={{ setHeaderTitle }} />
      </div>
    </div>
  ) : (
    <Navigate to="/dang-nhap" replace />
  );
};

export default AdminRoute;
