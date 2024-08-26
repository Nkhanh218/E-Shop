import React, { useEffect, useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApiSlice";
import Loader from "../../component/Loader";
import Message from "../../component/Message";
import { Space, Table, Tag, Button, Popconfirm } from "antd";
import { useOutletContext } from "react-router-dom";
import "./custom.css";
const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const { setHeaderTitle } = useOutletContext();

  useEffect(() => {
    setHeaderTitle("Quản lý người dùng");
  }, [setHeaderTitle]);
  console.log(users);

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
      title: "ID",
      dataIndex: "_id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai Trò",
      key: "isAdmin",
      dataIndex: "isAdmin",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            type="primary"
            onClick={() => console.log("Edit", record._id)}
          >
            Edit
          </Button> */}
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
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone || "N/A",
    isAdmin: (
      <Tag color={user.isAdmin ? "red" : "geekblue"}>
        {user.isAdmin ? "Admin" : "Người dùng"}
      </Tag>
    ),
  }));

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className=" flex justify-center items-center  ">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-6xl w-full">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data.message || error.message}
          </Message>
        ) : (
          <div className="flex flex-col items-center justify-center md:flex-row w-full">
            <Table
              className="custom-table"
              columns={columns}
              dataSource={data}
              rowKey="_id"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
