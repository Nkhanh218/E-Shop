import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Upload } from "antd";

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
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          size="large"
          type="text"
          className="py-2 px-4 rounded-lg  w-full "
          placeholder="Viết tên thể loại"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />
        <div className="pt-4">
          <Upload
            listType="picture"
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUploadChange}
            disabled={isLoading}
          >
            <Button
              size="large"
              icon={<UploadOutlined />}
              loading={isLoading}
              aria-label="Chọn ảnh"
            >
              {isLoading ? "Đang tải ảnh..." : "Chọn ảnh"}
            </Button>
          </Upload>
        </div>
        <div className="flex justify-between pt-4">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? `Đang ${buttonText}...` : buttonText}
          </Button>

          {handleDelete && (
            <Button
              size="large"
              loading={isLoading}
              danger
              onClick={handleDelete}
              aria-label="Xoá"
              disabled={isLoading}
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
