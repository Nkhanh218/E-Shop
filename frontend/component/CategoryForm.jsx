import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  setImage,
  isLoading = false,
  buttonText = "Thêm Thể Loại",
  handleDelete,
}) => {
  const handleImageUploadChange = ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      setImage(fileList[0].originFileObj || null);
    } else {
      setImage(null);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Viết tên thể loại"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="pt-4">
          <Upload
            listType="picture"
            maxCount={1}
            status="done"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUploadChange}
          >
            <Button
              icon={<UploadOutlined />}
              loading={isLoading}
              aria-label="Chọn ảnh"
            >
              {isLoading ? "Đang tải ảnh..." : "Chọn ảnh"}
            </Button>
          </Upload>
        </div>
        <div className="flex justify-between pt-4">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isLoading ? "Đang " + buttonText + "..." : buttonText}
          </Button>

          {handleDelete && (
            <Button
              loading={isLoading}
              danger
              onClick={handleDelete}
              aria-label="Xoá"
            >
              {isLoading ? "Đang Xoá..." : "Xoá"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
