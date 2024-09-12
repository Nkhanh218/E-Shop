import React, { useEffect, useState } from "react";
import {
  useGetEventsQuery,
  useDeleteEventMutation,
  useCreateEventMutation,
  useUploadEventImageMutation,
  useDeleteimageclouldMutation,
  useUpdateEventMutation,
} from "../../redux/api/eventApiSlice";
import { useAllProductQuery } from "../../redux/api/productApiSlice";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Collapse,
  Tag,
  InputNumber,
  Upload,
  Divider,
} from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

const EventManagement = () => {
  const { data: events, isLoading, refetch } = useGetEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();
  const [deleteImageClould] = useDeleteimageclouldMutation();
  const { data: allProduct } = useAllProductQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const [image, setImage] = useState(null);
  const [color, setColor] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [variantDiscounts, setVariantDiscounts] = useState({});
  const [discountType, setDiscountType] = useState({});
  const [uploadEventImage] = useUploadEventImageMutation();
  const [currentEvent, setCurrentEvent] = useState(null);
  console.log(currentEvent);
  const handleDelete = async (id, current_url) => {
    await deleteEvent(id);
    if (current_url) {
      await deleteImageClould(current_url);
    }
    refetch();
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setImage(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentEvent(null);
    setSelectedProducts([]);
    form.resetFields(); // Reset form fields to clear previous data
    setTimeout(() => {
      form.setFieldsValue({ image: null }); // Clear the image field after form reset
    }, 0);
  };

  const handleImageUploadChange = ({ file }) => {
    setImage(file);
  };

  const handleUploadImageToServer = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("folder", "E_Shop/Events");

    try {
      const response = await uploadEventImage(formData).unwrap();
      return response.images[0].url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleProductChange = (value) => {
    setSelectedProducts(value);
  };

  const handleSubmit = async (values) => {
    try {
      const { title, dateRange, color } = values;
      const [startDate, endDate] = dateRange || [];

      const url = await handleUploadImageToServer(image.originFileObj || null);

      const eventProducts = selectedProducts.map((productId) => {
        const product = allProduct.find((product) => product._id === productId);
        const productVariants = product.variants.map((variant) => {
          const discountValue = variantDiscounts[productId]?.[variant._id] || 0;
          const discountTypeValue =
            discountType[productId]?.[variant._id] || "percentage";
          let finalPrice;

          if (discountTypeValue === "percentage") {
            finalPrice = variant.price - (variant.price * discountValue) / 100;
          } else if (discountTypeValue === "price") {
            finalPrice = variant.price - discountValue;
          }
          finalPrice = Math.round(finalPrice);
          return {
            _id: variant._id,
            discountValue,
            discountType: discountTypeValue,
            finalPrice,
          };
        });

        return {
          product: productId,
          variants: productVariants,
        };
      });

      await createEvent({
        title,
        startDate,
        endDate,
        color,
        url,
        products: eventProducts,
      });

      toast.success("Sự kiện được tạo thành công!");
      refetch();
      setIsModalVisible(false);
      setSelectedProducts([]);
      form.resetFields();
      setVariantDiscounts({});
      setDiscountType({});
    } catch (error) {
      console.error("Event creation failed:", error);
      toast.error("Tạo sự kiện thất bại!");
    }
  };

  const handleDiscountTypeChange = (productId, variantId, type) => {
    setDiscountType((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variantId]: type,
      },
    }));
    setVariantDiscounts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variantId]: 0,
      },
    }));
  };

  const handleDiscountValueChange = (productId, variantId, value) => {
    setVariantDiscounts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variantId]: value,
      },
    }));
  };

  const productOptions = allProduct?.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const getSelectedProductDetails = () => {
    return allProduct?.filter((product) =>
      selectedProducts.includes(product._id)
    );
  };

  // ... existing code ...
  const columns = [
    {
      title: "Tiêu đề sự kiện",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img src={images?.url} alt="event" className="w-[200px]" />
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    // {
    //   title: "Loại giảm giá",
    //   dataIndex: "products",
    //   key: "discountType",
    //   render: (products) => (
    //     <ul>
    //       {products.map((product) => {
    //         const foundProduct = allProduct?.find(
    //           (p) => p._id === product.product
    //         );
    //         return product.variants.map((variant) => (
    //           <li key={variant._id}>
    //             {foundProduct?.name} - Màu: {variant.color}, Dung lượng:{" "}
    //             {variant.storage} -{" "}
    //             {variant.discountType === "percentage" ? "%" : "Giá tiền"}
    //           </li>
    //         ));
    //       })}
    //     </ul>
    //   ),
    // },
    {
      width: 300,
      title: "Giá trị giảm giá",
      dataIndex: "products",
      key: "discountValue",
      render: (products) => {
        const productMap = products.reduce((acc, { product, variants }) => {
          const foundProduct = allProduct?.find((p) => p._id === product);
          if (foundProduct) {
            acc[product] = {
              name: foundProduct.name,
              variants: variants.map((variant) => {
                const foundVariant = foundProduct.variants.find(
                  (v) => v._id === variant._id
                );
                const discountValue = variant.discountValue;
                const discountType = variant.discountType;
                let finalPrice = foundVariant?.price;
                finalPrice = Math.round(finalPrice);

                if (discountType === "price") {
                  finalPrice -= discountValue;
                  finalPrice = Math.round(finalPrice);
                } else if (discountType === "percentage") {
                  finalPrice -= (finalPrice * discountValue) / 100;
                  finalPrice = Math.round(finalPrice);
                }

                return {
                  ...variant,
                  color: foundVariant?.color,
                  storage: foundVariant?.storage,
                  finalPrice,
                };
              }),
            };
          }
          return acc;
        }, {});

        return (
          <ul>
            {Object.values(productMap).map(({ name, variants }) => (
              <li key={name}>
                <p className="font-bold">{name}: </p>

                <ul>
                  {variants.map(
                    ({
                      _id,
                      color,
                      storage,
                      discountValue,
                      discountType,
                      finalPrice,
                    }) => (
                      <li key={_id}>
                        <div className="text-base">
                          {color} {storage} |{" "}
                          <span className="text-red-600">
                            {discountValue}
                            {discountType === "price" ? "₫" : "%"}
                          </span>{" "}
                          <span className="text-green-600">{finalPrice}₫</span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <Divider
                  className="w-[]"
                  style={{
                    borderColor: "black",
                  }}
                />
              </li>
            ))}
          </ul>
        );
      },
    },

    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: color,
            borderRadius: "50%",
          }}
        />
      ),
    },

    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sự kiện này không?"
            onConfirm={() => handleDelete(record._id, record?.images?.url)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];
  // ... existing code ...

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium mb-4 ">Quản lý event</p>
      <Button
        type="primary"
        onClick={handleAddEvent}
        style={{ marginBottom: 16 }}
      >
        Thêm sự kiện
      </Button>
      <Table columns={columns} dataSource={events} rowKey="_id" />

      <Modal
        width={800}
        title={currentEvent ? "Cập nhật sự kiện" : "Thêm sự kiện mới"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="rounded-lg shadow-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            label="Tiêu đề sự kiện"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            rules={[{ required: true, message: "Hãy điền tên sự kiện" }]}
            className="text-lg"
          >
            <Input className="border-gray-300 rounded-lg p-2" />
          </Form.Item>

          <Form.Item
            label="Thời gian diễn ra"
            required
            name="dateRange"
            className="flex items-center gap-2"
          >
            <RangePicker onChange={(dates) => setDateRange(dates)} />
          </Form.Item>
          <Form.Item label="Banner giảm giá" name="image" className="text-lg">
            <Upload
              onChange={handleImageUploadChange}
              listType="picture"
              maxCount={1}
              accept=".jpg,.jpeg,.png"
              showUploadList={true}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Tải ảnh lên
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Màu sắc"
            name="color"
            rules={[
              { required: true, message: "Chọn màu sắc cho khung sự kiện" },
            ]}
            className="text-lg"
          >
            <Input
              type="color"
              className="w-full h-10 rounded-lg"
              onChange={(e) => setColor(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Sản phẩm"
            name="products"
            rules={[
              { required: true, message: "Lựa chọn sản phẩm cho sự kiện" },
            ]}
            className="text-lg"
          >
            <Select
              mode="multiple"
              placeholder="Lựa chọn sản phẩm cho sự kiện giảm giá"
              allowClear
              showSearch
              onChange={handleProductChange}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={productOptions}
              className="border-gray-300 rounded-lg p-2"
            />
          </Form.Item>

          <Collapse>
            {getSelectedProductDetails()?.map((product) => (
              <Panel key={product._id} header={product.name}>
                {product.variants?.map((variant) => {
                  const discountValue =
                    variantDiscounts[product._id]?.[variant._id] || 0;
                  const discountTypeValue =
                    discountType[product._id]?.[variant._id] || "percentage";
                  let finalPrice;

                  if (discountTypeValue === "percentage") {
                    finalPrice =
                      variant.price - (variant.price * discountValue) / 100;
                  } else if (discountTypeValue === "price") {
                    finalPrice = variant.price - discountValue;
                  }
                  finalPrice = Math.round(finalPrice);
                  return (
                    <div
                      key={variant._id}
                      className="flex items-center gap-4 mb-2"
                    >
                      <div className="w-[30%]">
                        <Tag className="text-sm" color="magenta">
                          {`Màu: ${variant.color} `}
                          <br />
                          {`Dung lượng: ${variant.storage}`}
                        </Tag>
                      </div>
                      <div className="w-[15%]">
                        <Select
                          defaultValue="percentage"
                          placeholder="Giảm giá theo"
                          onChange={(value) =>
                            handleDiscountTypeChange(
                              product._id,
                              variant._id,
                              value
                            )
                          }
                          className="border-gray-300 rounded-lg p-2 w-full"
                        >
                          <Option value="price">Giá tiền</Option>
                          <Option value="percentage">%</Option>
                        </Select>
                      </div>
                      <div className="w-[20%]">
                        {discountType[product._id]?.[variant._id] ===
                        "price" ? (
                          <InputNumber
                            value={
                              variantDiscounts[product._id]?.[variant._id] || 0
                            }
                            placeholder="Nhập giá giảm"
                            formatter={(value) =>
                              `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
                            onChange={(value) =>
                              handleDiscountValueChange(
                                product._id,
                                variant._id,
                                value
                              )
                            }
                            className="border-gray-300 rounded-lg p-2 w-full"
                          />
                        ) : (
                          <InputNumber
                            min={0}
                            max={100}
                            value={
                              variantDiscounts[product._id]?.[variant._id] || 0
                            }
                            placeholder="Giảm % theo giá gốc"
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace("%", "")}
                            onChange={(value) =>
                              handleDiscountValueChange(
                                product._id,
                                variant._id,
                                value
                              )
                            }
                            className="border-gray-300 rounded-lg p-2"
                          />
                        )}
                      </div>
                      <div>
                        <p>Giá gốc: {variant.price}₫</p>
                        <p>Giá khuyến mãi: {finalPrice}₫</p>
                      </div>
                    </div>
                  );
                })}
              </Panel>
            ))}
          </Collapse>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-4">
              {currentEvent ? "Cập nhật sự kiện" : "Tạo sự kiện"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventManagement;
