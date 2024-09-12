import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ProductOutlined,
  SlidersOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";

const AdminMenu = ({ collapsed, toggleCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/dang-nhap");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      toggleCollapsed(true); // Close the menu when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <NavLink to="/admin/bang-dieu-khien">
          <DashboardOutlined style={{ fontSize: 20 }} />
          <span className="text-base">Bảng điều khiển</span>
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink to="/admin/ds-nguoi-dung">
          <div className="flex items-center">
            <UsergroupDeleteOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Quản lý người dùng</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "3",
      label: (
        <NavLink to="/admin/them-san-pham">
          <div className="flex items-center">
            <AppstoreAddOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Thêm sản phẩm</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "4",
      label: (
        <NavLink to="/admin/tat-ca-san-pham">
          <div className="flex items-center">
            <ProductOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Tất cả sản phẩm</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "5",
      label: (
        <NavLink to="/admin/ds-the-loai">
          <div className="flex items-center">
            <AppstoreOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Quản lý thể loại</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "6",
      label: (
        <NavLink to="/admin/quan-ly-banner">
          <div className="flex items-center">
            <SlidersOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Quản lý banner</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "8",
      label: (
        <NavLink to="/admin/quan-ly-event">
          <NotificationOutlined style={{ fontSize: 20 }} />
          <span className="text-base">Quản lý event</span>
        </NavLink>
      ),
    },
    {
      key: "9",
      label: (
        <NavLink to="/admin/quan-ly-don-hang">
          <FileDoneOutlined style={{ fontSize: 20 }} />
          <span className="text-base">Quản lý đơn hàng</span>
        </NavLink>
      ),
    },
    {
      key: "10",
      label: (
        <NavLink to="/admin/tai-khoan-cua-toi">
          <div className="flex items-center">
            <UserOutlined style={{ fontSize: 20 }} />
            <span className="text-base">Tài Khoản Của Tôi</span>
          </div>
        </NavLink>
      ),
    },
    {
      key: "11",
      label: (
        <div className="flex items-center ">
          <LogoutOutlined style={{ fontSize: 20 }} />
          <span className="text-base">{loading ? <Spin /> : "Đăng Xuất"}</span>
        </div>
      ),
      onClick: logoutHandler,
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`${collapsed ? "lg:block hidden" : "block"} `}
    >
      <div className="bg-[#001529] h-26">
        <div className="flex justify-center items-center lg:py-10">
          <div className="lg:block hidden">
            <img
              className="w-10 h-10 pr-1"
              src="https://res.cloudinary.com/doh7f7ja9/image/upload/t_Logo/v1725437731/Online-shop-shopping-shop-logo-by-DEEMKA-STUDIO-3-580x406-removebg-preview_cncfqz.png"
              alt=""
            />
            <p
              className={`text-2xl text-white font-extrabold ${
                collapsed ? "hidden" : "block"
              } `}
            >
              Admin
            </p>
          </div>
        </div>
        <Menu
          className={`lg:relative absolute xl:z-0 z-10 h-screen transition-all ${
            collapsed ? "w-20" : "w-64"
          }`}
          defaultSelectedKeys={["1"]}
          mode="inline"
          theme="dark"
          items={items}
          inlineCollapsed={collapsed}
        />
      </div>
      <div className="flex-1"></div>
    </div>
  );
};

export default AdminMenu;
