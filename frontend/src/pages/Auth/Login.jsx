import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Loader from "../../component/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  console.log(userInfo);
  useEffect(() => {
    if (userInfo) {
      const target = userInfo.isAdmin ? "/admin/" : redirect;
      navigate(target);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#EDF2F9] pt-10 ">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <Link to="/">
            <ArrowLeftOutlined className="text-xl" />
          </Link>
          <Link
            to={redirect ? `/dang-ky?redirect=${redirect}` : "/dang-ky"}
            className="text-blue-500 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
        <hr className="my-4" />
        <p className="font-semibold text-3xl text-center">Đăng nhập</p>
        <div className="mt-10">
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ email, password }}
            autoComplete="off"
          >
            <Form.Item
              label="Địa chỉ Email"
              name="email"
              rules={[{ required: true, message: "Nhập địa chỉ Email" }]}
            >
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[40px] w-full"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Nhập mật khẩu" }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[40px] w-full"
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="h-[40px] w-full rounded-3xl"
                type="primary"
                htmlType="submit"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              {isLoading && <Loader />}
            </Form.Item>
          </Form>
        </div>
        <div className="text-center underline mt-10">
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
