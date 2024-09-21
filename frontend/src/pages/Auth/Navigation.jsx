import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../index.css";
import { Button, Drawer, Dropdown, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  DownOutlined,
  HeartFilled,
  MenuOutlined,
  ShoppingFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

const { Search } = Input;

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [openMenu, setOpenmenu] = useState(false);
  const searchContainerRef = useRef(null);
  const { data, isLoading, isError } = useFetchCategoriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);

  const categoriesItem = useMemo(() => {
    return data?.map((category) => ({
      key: category._id,
      label: <Link to={`/danh-muc/${category.slug}`}>{category.name}</Link>,
    }));
  }, [data]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts = productData.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filteredProducts);
  };

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setSearchData([]);
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
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const userItems = [
    { key: "1", label: <Link to="/ho-so">Tài Khoản Của Tôi</Link> },
    { key: "2", label: <Link to="/profile">Đơn Mua</Link> },
    { key: "3", label: <a onClick={logoutHandler}>Đăng xuất</a> },
  ];

  const adminItems = [
    { key: "1", label: <Link to="/dashboard">Bảng Điều Khiển</Link> },
    {
      key: "2",
      label: <Link to="/admin/ds-nguoi-dung">Quản Lý Người Dùng</Link>,
    },
    { key: "3", label: <Link to="/dashboard">Quản Lý Sản Phẩm</Link> },
    { key: "4", label: <Link to="/admin/ds-the-loai">Quản Lý Thể Loại</Link> },
    { key: "5", label: <Link to="/dashboard">Quản Lý Đơn Hàng</Link> },
    { key: "6", label: <Link to="/ho-so">Tài Khoản của tôi</Link> },
    { key: "7", label: <a onClick={logoutHandler}>Đăng xuất</a> },
  ];

  if (!userInfo?.isAdmin) {
    return (
      <header className="bg-[#4a90e2] shadow-lg fixed top-0 w-full z-10 px-40">
        <div className="flex flex-col container ">
          <div className="flex justify-between items-center ">
            <Link to="/">
              <img
                className="w-[60px] h-[80px]"
                src="https://res.cloudinary.com/doh7f7ja9/image/upload/t_Logo/v1724588510/logo_hmnuue.png"
                alt="Logo"
              />
            </Link>
            <div>
              <Dropdown menu={{ items: categoriesItem }}>
                <Button>
                  Thể loại <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div ref={searchContainerRef} className="relative">
              <Search
                className="w-[250px] sm:w-[400px] md:w-[600px]"
                onChange={handleSearchChange}
                placeholder="Nhập từ khoá cần tìm"
                value={searchTerm}
              />
            </div>
            <div className="md:flex justify-between items-center space-x-4">
              <HeartFilled className="hidden md:flex text-2xl text-white cursor-pointer" />
              <Link to="/cart">
                <ShoppingFilled className="text-2xl text-white cursor-pointer" />
              </Link>
              {userInfo ? (
                <>
                  <Link to="/profile" className="px-2 w-10 cursor-pointer">
                    <img
                      className="rounded-full w-6 h-6"
                      src={userInfo.avatar?.url || "path/to/default-avatar.png"}
                      alt="User Avatar"
                    />
                  </Link>
                  <Dropdown
                    menu={{
                      items: userInfo.isAdmin ? adminItems : userItems,
                    }}
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
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return null;
};

export default Navigation;
