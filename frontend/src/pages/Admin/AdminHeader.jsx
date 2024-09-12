import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const AdminHeader = ({ title, toggleCollapsed, collapsed }) => {
  return (
    <div className="bg-white h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-8 lg:px-16">
      {/* Toggle Button */}
      <Button type="primary" onClick={toggleCollapsed} className="ml-2 sm:ml-4">
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      {/* Search Bar */}
      <div className="relative flex items-center flex-grow md:max-w-[400px] max-w-[150px]">
        <SearchOutlined className="absolute left-3 text-gray-500" />
        <input
          type="text"
          className="bg-[#EDF2F9] w-full h-10 pl-10 pr-4 rounded-full text-sm"
          placeholder="Tìm kiếm..."
        />
      </div>

      {/* Settings and Notifications Icons */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-[#EDF2F9] rounded-full flex justify-center items-center cursor-pointer">
          <SettingOutlined className="text-gray-500 text-lg" />
        </div>
        <div className="w-8 h-8 bg-[#EDF2F9] rounded-full flex justify-center items-center cursor-pointer">
          <BellOutlined className="text-gray-500 text-lg" />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
