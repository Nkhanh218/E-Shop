import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AdminMenu from "./AdminMenu"; // Ensure the path is correct
import AdminHeader from "./AdminHeader";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [headerTitle, setHeaderTitle] = useState("");
  return userInfo && userInfo.isAdmin ? (
    <div className=" flex flex-col md:flex-row ">
      <div className="">
        <AdminMenu />
      </div>
      <div className="w-[100%]">
        <AdminHeader title={headerTitle} />
        <Outlet context={{ setHeaderTitle }} />
      </div>
    </div>
  ) : (
    <Navigate to="/dang-nhap" replace />
  );
};

export default AdminRoute;
