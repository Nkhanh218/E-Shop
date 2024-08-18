import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { useDispatch } from "react-redux";
import { Button, Form, Input } from "antd";
import Loader from "../../component/Loader";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";

const ProfileContent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
    setPhone(userInfo.phone);
  }, [userInfo.username, userInfo.email, userInfo.phone]);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          phone,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Cập nhật thành công");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div>
      <p className=" text-xl font-semibold text-gray-500">Hồ Sơ Của Tôi </p>
      <p className="pb-4">Quản lý hồ sơ để bảo mật tài khoản</p>
      <hr />
      <div className="pt-10 pl-10">
        <div
          className=""
          style={{ display: "flex", justifyContent: "center" }}
        ></div>
        <div className="profile-form mt-30 flex justify-around ">
          <div>
            <Form
              form={form}
              onFinish={handleUpdateProfile}
              style={{ maxWidth: 600 }}
              layout="vertical"
            >
              <Form.Item
                label="Tên người dùng"
                rules={[
                  { required: true, message: "Hãy nhập tên người dùng!" },
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-[40px] w-[336px]"
                />
              </Form.Item>
              {/* <Form.Item
                label="Email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Hãy nhập địa chỉ email hợp lệ!",
                  },
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[40px] w-[336px]"
                />
              </Form.Item> */}
              <Form.Item
                label="Số điện thoại"
                rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[40px] w-[336px]"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingUpdateProfile}
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Form
              form={form}
              onFinish={handleUpdateProfile}
              style={{ maxWidth: 600 }}
              layout="vertical"
            >
              <Form.Item label="Mật khẩu mới" style={{ marginBottom: "16px" }}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[40px] w-[336px]"
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                style={{ marginBottom: "16px" }}
              >
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-[40px] w-[336px]"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
