import React, { useEffect } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApiSlice";
import Loader from "../../component/Loader";
import Message from "../../component/Message";
import { Space, Table, Tag, Button, Popconfirm } from "antd";
import "tailwindcss/tailwind.css";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const confirm = async (id) => {
    try {
      await deleteUser(id);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const columns = [
    {
      title: "Tên Người Dùng",
      dataIndex: "username",
      key: "username",
      className: "whitespace-nowrap",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "whitespace-nowrap",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      className: "whitespace-nowrap",
    },
    {
      title: "Vai Trò",
      key: "isAdmin",
      dataIndex: "isAdmin",
      className: "whitespace-nowrap",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "red" : "geekblue"}>
          {isAdmin ? "Admin" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Xoá người dùng"
            description={`Bạn có chắc chắn muốn xoá ${record.username} ?`}
            onConfirm={() => confirm(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = users?.map((user) => ({
    key: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone || "N/A",
    isAdmin: user.isAdmin,
  }));

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium mb-4">
        Quản lý người dùng
      </p>
      <div className="w-full overflow-x-auto ">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <Table
            className="custom-table"
            columns={columns}
            dataSource={data}
            rowKey="_id"
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;
