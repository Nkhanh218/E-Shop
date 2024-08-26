import {
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <div className="bg-white h-32 flex items-center  ml-1 mb-12 px-16 ">
      <div className="text-2xl font-semibold flex-1">{title}</div>
      <div className="relative flex items-center">
        <SearchOutlined className="absolute left-4 text-gray-500" />
        <input
          type="text"
          className="bg-[#EDF2F9] w-[250px] h-12 pl-12 pr-4 rounded-full"
          placeholder="Tìm kiếm..."
        />
      </div>
      <div className="w-12 h-12 bg-[#EDF2F9] ml-4 rounded-full flex justify-center items-center cursor-pointer">
        <SettingOutlined className="text-gray-500 text-xl" />
      </div>
      <div className="w-12 h-12 bg-[#EDF2F9] ml-4  rounded-full flex justify-center items-center cursor-pointer">
        <BellOutlined className="text-gray-500 text-xl" />
      </div>
    </div>
  );
};

export default AdminHeader;
