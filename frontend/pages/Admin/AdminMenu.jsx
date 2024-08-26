import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  DashboardFilled,
  ProductFilled,
  ShoppingFilled,
} from "@ant-design/icons";

import { ImUsers } from "react-icons/im";

import { FaUserCog } from "react-icons/fa";

import { TbCategoryFilled } from "react-icons/tb";
import { RiLogoutCircleFill } from "react-icons/ri";

const AdminMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/dang-nhap");
    } catch (error) {
      console.log(error);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <NavLink
          to="/admin/bang-dieu-khien"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <DashboardFilled style={{ fontSize: 23 }} />
          <span className="text-lg">Bảng điều khiển</span>
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink
          to="/admin/ds-nguoi-dung"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <div className="flex items-center">
            <ImUsers style={{ fontSize: 25, marginRight: "10px" }} />
            <span className="text-lg  ">Quản lý người dùng</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "3",
      label: (
        <NavLink
          to="/admin/them-san-pham"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <div className="flex items-center">
            <ProductFilled style={{ fontSize: 23 }} />
            <span className="text-lg">Thêm sản phẩm</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "4",
      label: (
        <NavLink
          to="/admin/tat-ca-san-pham"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <div className="flex items-center">
            <ProductFilled style={{ fontSize: 23 }} />
            <span className="text-lg">Tất cả sản phẩm</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "5",
      label: (
        <NavLink
          to="/admin/ds-the-loai"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <div className="flex items-center">
            <TbCategoryFilled style={{ fontSize: 25, marginRight: "10px" }} />
            <span className="text-lg">Quản lý thể loại</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "6",
      label: (
        <NavLink
          to="/admin/quan-ly-don-hang"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <ShoppingFilled style={{ fontSize: 23 }} />
          <span className="text-lg">Quản lý đơn hàng</span>
        </NavLink>
      ),
    },
    {
      key: "7",
      label: (
        <NavLink
          to="/admin/tai-khoan-cua-toi"
          className={({ isActive }) =>
            isActive ? "text-[#1677ff]" : "text-[#B1B1B1]"
          }
        >
          <div className="flex items-center">
            <FaUserCog style={{ fontSize: 25, marginRight: "10px" }} />
            <span className="text-lg">Tài Khoản Của Tôi</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "8",
      label: (
        <div className="flex items-center">
          <RiLogoutCircleFill style={{ fontSize: 23, marginRight: "10px" }} />
          <span className="text-lg " onClick={logoutHandler}>
            Đăng Xuất
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white">
        <div className="flex justify-center items-center ">
          <img
            className="w-[100px] h-[120px]"
            src="https://res.cloudinary.com/doh7f7ja9/image/upload/t_Logo/v1724588510/logo_hmnuue.png"
            alt="Logo"
          />
        </div>
        <Menu
          style={{ width: 256, height: "100vh" }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
};

export default AdminMenu;
