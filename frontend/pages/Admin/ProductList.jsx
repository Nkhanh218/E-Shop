import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Row,
  Col,
  Select,
  Image,
} from "antd";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const ProductList = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const navigate = useNavigate();
  const { setHeaderTitle } = useOutletContext();

  useEffect(() => {
    setHeaderTitle("Thêm sản phẩm");
  }, [setHeaderTitle]);

  const prcategory = categories?.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const handleImageUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadImageToServer = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("folder", "E_Shop/Product");

    try {
      const response = await uploadProductImage(formData).unwrap();
      console.log(response.images[0].url);
      return response.images[0].url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    try {
      let uploadedImages = [];
      if (fileList.length > 0) {
        const uploadPromises = fileList.map((file) =>
          uploadImageToServer(file.originFileObj)
        );
        const results = await Promise.all(uploadPromises);
        console.log("Upload results:", results);
        uploadedImages = results.filter((url) => url !== null);
      }

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((url, index) => {
          productData.append(`images[${index}]`, url);
        });
      }
      const { data } = await createProduct(productData);
      console.log(data);
      if (data.error) {
        toast.error("Tạo sản phẩm thất bại. Vui lòng thử lại.");
      } else {
        toast.success(`${data.name} đã được tạo`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center     ">
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Upload
            listType="picture-card"
            fileList={fileList}
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUploadChange}
            multiple
            className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md"
          >
            {fileList.length >= 8 ? null : (
              <div className="flex flex-col items-center justify-center">
                <PlusOutlined />
                <div className="mt-2">Tải hình ảnh sản phẩm</div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <div className="w-full md:w-2/3">
            <Form
              onFinish={handleSubmit}
              name="nest-messages"
              layout="vertical"
              className="w-full"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className="w-full"
                  >
                    <Input
                      value={name}
                      size="large"
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Giá tiền"
                    rules={[
                      {
                        type: "number",
                        required: true,
                      },
                    ]}
                    className="w-full"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      value={price}
                      size="large"
                      onChange={(value) => setPrice(value)}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="Số lượng"
                    rules={[
                      {
                        required: true,

                        type: "number",
                        min: 0,
                      },
                    ]}
                    className="w-full"
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      value={quantity}
                      onChange={(value) => setQuantity(value)}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="brand"
                    label="Hãng"
                    className="w-full"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <p className="pb-2"> Số lượng trong cửa hàng</p>
                  <Form.Item
                    name="stock"
                    className="w-full"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      value={stock}
                      onChange={(value) => setStock(value)}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Thể loại"
                    className="w-full"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      size="large"
                      placeholder="Chọn thể loại"
                      optionFilterProp="label"
                      value={category}
                      onChange={(value) => setCategory(value)}
                      options={prcategory}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả sản phẩm",
                  },
                ]}
                className="w-full"
              >
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  showCount
                  maxLength={500}
                  placeholder="Mô tả sản phẩm chi tiết"
                  style={{
                    height: 150,
                    resize: "vertical",
                    width: "100%",
                  }}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full "
                >
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
