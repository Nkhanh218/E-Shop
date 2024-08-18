import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./../../component/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userApiSlice";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không trùng khớp");
    } else {
      try {
        const res = await register({
          username,
          email,
          phone,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Đăng ký thành công");
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F2F5] pt-32">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Đăng ký</h1>
        <Form
          onSubmit={handleSubmit}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Tên người dùng"
            name="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            rules={[{ required: true, message: "Nhập tên đầy đủ" }]}
          >
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rules={[{ required: true, message: "Nhập email" }]}
          >
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            rules={[
              { required: true, message: "Nhập số điện thoại" },
              {
                pattern: /((\+84|84|0)+([3|5|7|8|9])+([0-9]{8})\b)/g,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password className="h-[40px]" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
          >
            <Input.Password className="h-[40px]" />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={isLoading}
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              className="h-[40px] w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
            {isLoading && <Loader />}
          </Form.Item>
        </Form>
        <div className="mt-4 text-center">
          <p className="text-gray-500">Bạn đã có tài khoản?</p>
          <Link
            to={redirect ? `/dang-nhap?redirect=${redirect}` : "/dang-nhap"}
            className="text-blue-500 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
