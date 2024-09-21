import React, { useEffect, useState } from "react";
import { Button, Upload, Spin, Form, Checkbox, Popconfirm } from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "../../redux/api/BannerApiSlice.js";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./BannerManagement.module.css";
import { useOutletContext } from "react-router-dom";

const BannerManagement = () => {
  const { data: banners = [], refetch } = useGetBannersQuery();
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [newBanner, setNewBanner] = useState({
    mainBanner: { public_id: "", url: "" },
    smallSlider: Array(6).fill({ public_id: "", url: "" }),
    smallBanner: { public_id: "", url: "" },
    visible: false,
  });

  const [selectedFiles, setSelectedFiles] = useState({
    mainBanner: null,
    smallSlider: Array(6).fill(null),
    smallBanner: null,
  });
  const { setHeaderTitle } = useOutletContext();

  useEffect(() => {
    setHeaderTitle(`Tất cả banner (${banners.length || 0})`);
  }, [setHeaderTitle, banners]);

  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file, type, index = null) => {
    if (type === "mainBanner" || type === "smallBanner") {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
    } else {
      setSelectedFiles((prev) => {
        const newArray = [...prev[type]];
        newArray[index] = file;
        return { ...prev, [type]: newArray };
      });
    }
  };

  const uploadFile = async (file, type, index = null) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "banners");

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data && data.images && data.images.length > 0) {
        const publicIdString = data.images[0].public_id.join("/");
        return {
          public_id: publicIdString,
          url: data.images[0].url,
        };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    return { public_id: "", url: "" };
  };

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      const uploadedImages = await Promise.all([
        uploadFile(selectedFiles.mainBanner, "mainBanner"),
        ...selectedFiles.smallSlider.map((file) =>
          uploadFile(file, "smallSlider")
        ),
        uploadFile(selectedFiles.smallBanner, "smallBanner"),
      ]);

      const updatedBanner = {
        mainBanner: uploadedImages[0] || { public_id: "", url: "" },
        smallSlider: uploadedImages
          .slice(1, 7)
          .map((img) => img || { public_id: "", url: "" }),
        smallBanner: uploadedImages[7] || { public_id: "", url: "" },
        visible: newBanner.visible,
      };

      await createBanner(updatedBanner);

      setNewBanner({
        mainBanner: { public_id: "", url: "" },
        smallSlider: Array(6).fill({ public_id: "", url: "" }),
        smallBanner: { public_id: "", url: "" },
        visible: false,
      });
      setSelectedFiles({
        mainBanner: null,
        smallSlider: Array(6).fill(null),
        smallBanner: null,
      });
      refetch();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    try {
      await deleteBanner(bannerId);
      refetch();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleVisibilityChange = async (bannerId, visible) => {
    console.log(bannerId, visible);
    try {
      await updateBanner({ id: bannerId, visible });
      refetch();
    } catch (error) {
      console.error("Error updating banner visibility:", error);
    }
  };

  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    prevArrow: <div className={styles["slick-prev"]} />, // Apply the scoped class
    nextArrow: <div className={styles["slick-next"]} />,
  };

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium mb-4 ">
        Quản lý banner
      </p>
      <div className="flex justify-center items-center  ">
        <div className="bg-white lg:p-4  p-4  rounded-lg shadow-lg  w-full ">
          <Form onFinish={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Banner Chính</h2>
              <Upload
                listType="picture"
                maxCount={1}
                accept=".jpg,.jpeg,.png"
                className="mb-4"
                beforeUpload={(file) => {
                  handleFileSelect(file, "mainBanner");
                  return false; // Prevent automatic upload
                }}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh Banner chính</Button>
              </Upload>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Slider Nhỏ</h2>
              {selectedFiles.smallSlider.map((_, index) => (
                <div key={index} className="mb-4">
                  <Upload
                    listType="picture"
                    maxCount={1}
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={(file) => {
                      handleFileSelect(file, "smallSlider", index);
                      return false; // Prevent automatic upload
                    }}
                    showUploadList={true}
                  >
                    <Button icon={<UploadOutlined />}>
                      Chọn ảnh Slider nhỏ {index + 1}
                    </Button>
                  </Upload>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Banner Nhỏ</h2>
              <Upload
                listType="picture"
                maxCount={1}
                accept=".jpg,.jpeg,.png"
                beforeUpload={(file) => {
                  handleFileSelect(file, "smallBanner");
                  return false; // Prevent automatic upload
                }}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh Banner nhỏ</Button>
              </Upload>
            </div>

            <Checkbox
              checked={newBanner.visible}
              onChange={(e) =>
                setNewBanner((prev) => ({ ...prev, visible: e.target.checked }))
              }
            >
              Hiển thị
            </Checkbox>

            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm Banner
            </Button>
          </Form>

          <h2 className="text-xl font-bold mt-8">Banner Hiện Có</h2>
          <ul className="mt-10">
            {banners.map((banner) => (
              <li
                key={banner._id}
                className="space-y-4 border border-black rounded-lg mt-10 "
              >
                <div
                  className="flex justify-between items-center m-5
              "
                >
                  <div>
                    <Popconfirm
                      className="mr-2"
                      description={`Bạn có chắc chắn muốn xoá  ?`}
                      onConfirm={() => handleDelete(banner._id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger>
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>

                    <Checkbox
                      checked={banner.visible}
                      onChange={(e) =>
                        handleVisibilityChange(banner._id, e.target.checked)
                      }
                    >
                      Hiển thị
                    </Checkbox>
                  </div>
                </div>
                <img
                  src={banner.mainBanner.url}
                  alt="Main Banner"
                  className="mb-2 w-full h-auto object-cover"
                />

                <div className="w-[500px] lg:w-[700px] ml-10">
                  <Slider {...slickSettings}>
                    {banner.smallSlider.map((slider, index) => (
                      <div key={index} className="p-2">
                        <img
                          src={slider.url}
                          alt={`Small Slider ${index + 1}`}
                          className="mb-2 h-auto object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>

                <div>
                  <img
                    src={banner.smallBanner.url}
                    alt="Small Banner"
                    className="mb-2 w-full h-auto object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
