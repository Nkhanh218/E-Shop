import React, { useState, useEffect, useRef } from "react";
import "../../src/index.css";
import { Button, Drawer, Dropdown, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

import {
  BellOutlined,
  DashboardOutlined,
  DownOutlined,
  FacebookFilled,
  GlobalOutlined,
  HeartOutlined,
  InstagramFilled,
  LogoutOutlined,
  MenuOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [openMenu, setOpenmenu] = useState(false);
  const searchContainerRef = useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    // setSearchTerm(term);
    const filteredProducts = productData.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    // setSearchData(filteredProducts);
  };

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      // setSearchData(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCalll] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCalll().unwrap();
      dispatch(logout());
      navigate("/dang-nhap");
    } catch (error) {
      console.log(error);
    }
  };

  const userItems = [
    {
      key: "1",
      label: <Link to="/ho-so">Tài Khoản Của Tôi</Link>,
    },
    {
      key: "2",
      label: <Link to="/profile">Đơn Mua</Link>,
    },
    {
      key: "3",
      label: (
        <a className="w-full h-full" onClick={logoutHandler}>
          Đăng xuất
        </a>
      ),
    },
  ];

  const adminItems = [
    {
      key: "1",
      label: <Link to="/dashboard"> Bảng Điều Khiển</Link>,
    },
    {
      key: "2",
      label: <Link to="/admin/ds-nguoi-dung">Quản Lý Người Dùng</Link>,
    },
    {
      key: "3",
      label: <Link to="/dashboard">Quản Lý Sản Phẩm</Link>,
    },
    {
      key: "4",
      label: <Link to="/admin/ds-the-loai">Quản Lý Thể Loại</Link>,
    },
    {
      key: "5",
      label: <Link to="/dashboard">Quản Lý Đơn Hàng</Link>,
    },
    {
      key: "6",
      label: <Link to="/ho-so">Tài Khoản của tôi</Link>,
    },

    {
      key: "7",
      label: (
        <a className="w-full h-full" onClick={logoutHandler}>
          Đăng xuất
        </a>
      ),
    },
  ];

  return (
    <div className="bg-[#4a90e2] shadow-lg fixed top-0 w-full z-10">
      <div className="flex flex-col">
        <div className="flex justify-around items-center p-2 ">
          <div className="flex ">
            <Link
              to="/connect"
              className="px-2 text-base text-white hidden md:block cursor-pointer"
            >
              Kết Nối <FacebookFilled className="text-lg" />{" "}
              <InstagramFilled className="text-lg" />
            </Link>
          </div>
          <div className="flex ">
            <Link
              to="/notifications"
              className="px-2 text-base text-white hidden sm:block cursor-pointer"
            >
              <BellOutlined /> Thông Báo
            </Link>
            <Link
              to="/support"
              className="px-2 text-base text-white hidden sm:block cursor-pointer"
            >
              <QuestionCircleOutlined /> Hỗ Trợ
            </Link>
            <Link
              to="/language"
              className="px-2 text-base text-white cursor-pointer"
            >
              <GlobalOutlined /> Tiếng Việt
            </Link>

            {userInfo ? (
              <>
                <Link to="/profile" className="px-2 w-10 cursor-pointer">
                  <img
                    className="rounded-full w-6 h-6"
                    // src={user.avatar.url}
                    alt=""
                  />
                </Link>
                <Dropdown
                  menu={{ items: userInfo.isAdmin ? adminItems : userItems }}
                  trigger={["click"]}
                >
                  <a
                    className="text-base text-white cursor-pointer"
                    onClick={(e) => e.preventDefault()}
                  >
                    {userInfo.username} <DownOutlined />
                  </a>
                </Dropdown>
              </>
            ) : (
              <>
                <Link
                  to="/dang-ky"
                  className="px-2 text-base text-white cursor-pointer"
                >
                  Đăng Ký
                </Link>
                <Link
                  to="/dang-nhap"
                  className="px-2 text-base text-white cursor-pointer"
                >
                  Đăng Nhập
                </Link>
              </>
            )}
          </div>
        </div>
        <hr />
        <div className="flex justify-around items-center p-4">
          <Link to="/">
            <img
              className="h-16 md:h-12 hidden sm:block"
              src="C:/Users/Admin/Desktop/DATN/uploads/logo.png"
              alt="Logo"
            />
          </Link>
          <div ref={searchContainerRef} className="relative">
            <MenuOutlined
              className="text-2xl sm:hidden px-4 cursor-pointer"
              onClick={() => setOpenmenu(true)}
            />
            <Search
              className="w-[250px] sm:w-[400px] md:w-[600px]"
              onChange={handleSearchChange}
              placeholder="Nhập từ khoá cần tìm"
              // value={searchTerm}
            />
            {/* {searchData && searchData.length !== 0 && (
              <div className="absolute bg-white border border-gray-300 w-full max-h-80 overflow-y-auto mt-2 z-50">
                {searchData.map((i, index) => (
                  <Link to={`/product/${i._id}`} key={index}>
                    <div className="flex items-center border-b border-gray-200 p-2 hover:bg-gray-100 cursor-pointer">
                      <img className="h-12 w-12 mr-2" />
                      <h1 className="text-base m-0"></h1>
                    </div>
                  </Link>
                ))}
              </div>
            )} */}
          </div>
          <div className="md:flex justify-between items-center space-x-4">
            <HeartOutlined
              className="hidden md:flex text-2xl text-white cursor-pointer"
              title="Wish List"
            />
            <Link to="/cart">
              <ShoppingCartOutlined
                className="text-2xl text-white cursor-pointer"
                title="Product Cart"
              />
            </Link>
          </div>
        </div>
        <Drawer
          title="Menu"
          width={250}
          placement="left"
          open={openMenu}
          onClose={() => setOpenmenu(false)}
          closable={false}
        >
          {/* <Navbar isInline /> */}
        </Drawer>
        <hr />
        {/* <div className="flex justify-between items-center p-4">
          <DropDown
            categoriesData={categoriesData}
            className="w-1/4 md:w-1/6"
          />
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Navigation;
