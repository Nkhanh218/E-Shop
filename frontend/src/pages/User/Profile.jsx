import React from "react";

import { Tabs } from "antd";
import {
  CompassOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  MessageOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ProfileContent from "./ProfileContent";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined className="text-xl" />,
      children: <ProfileContent />,
    },
    {
      key: "2",
      label: "Orders",
      icon: <ShoppingOutlined className="text-xl" />,
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Refunds",
      icon: <ReloadOutlined className="text-xl" />,
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "Inbox",
      icon: <MessageOutlined className="text-xl" />,
      children: "Content of Tab Pane 3",
    },
    {
      key: "5",
      label: "Track Order",
      icon: <CompassOutlined className="text-xl" />,
      children: "<Content of Tab Pane 3>",
    },
    {
      key: "6",
      label: "Payment Methods",
      icon: <CreditCardOutlined className="text-xl" />,
      children: "Content of Tab Pane 3",
    },
    {
      key: "7",
      label: "Address",
      icon: <EnvironmentOutlined className="text-xl" />,
      children: "Content of Tab Pane 3",
    },
    {
      key: "8",
      label: "Log out",
      icon: <LogoutOutlined className="text-xl" />,
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <div className="xl:px-32 pt-40">
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabPosition="left"
        size="large"
      />
    </div>
  );
};

export default Profile;
