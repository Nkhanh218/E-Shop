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
  Card,
  Divider,
} from "antd";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductList = () => {
  const [form] = Form.useForm(); // Use Form instance

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imageColors, setImageColors] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [specifications, setSpecifications] = useState([]);
  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const navigate = useNavigate();
  const { setHeaderTitle } = useOutletContext();
  const [variants, setVariants] = useState([
    { color: "", storage: "", price: 0, discountPrice: 0, stock: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("render");
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
  const handleColorChange = (file, color) => {
    setImageColors((prevColors) => ({
      ...prevColors,
      [file.uid]: color,
    }));
  };
  const uploadImageToServer = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("folder", "E_Shop/Product");

    try {
      const response = await uploadProductImage(formData).unwrap();
      return response.images[0].url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };
  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { storage: "", price: 0, discountPrice: 0, stock: 0 },
    ]);

  const removeVariant = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  const copyVariant = (index) => {
    const variantToCopy = variants[index];
    console.log("Copying variant:", variantToCopy);
    setVariants((prevVariants) => {
      const newVariants = [...prevVariants, { ...variantToCopy }]; // Sao chép đúng thuộc tính
      console.log("Updated variants:", newVariants);
      return newVariants;
    });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let uploadedImages = [];
      if (fileList.length > 0) {
        const uploadPromises = fileList.map((file) =>
          uploadImageToServer(file.originFileObj)
        );

        const results = await Promise.all(uploadPromises);
        uploadedImages = results.filter((url) => url !== null);
      }

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);

      productData.append("category", category);
      productData.append("brand", brand);
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((url, index) => {
          const color = imageColors[fileList[index].uid] || "";

          productData.append(`images[${index}]`, url);
          productData.append(`image[${index}][color]`, color);
        });
      }
      variants.forEach((variant, index) => {
        productData.append(`variants[${index}][color]`, variant.color);

        productData.append(`variants[${index}][storage]`, variant.storage);
        productData.append(`variants[${index}][price]`, variant.price);
        productData.append(
          `variants[${index}][discountPrice]`,
          variant.discountPrice
        );
        productData.append(`variants[${index}][stock]`, variant.stock);
      });
      console.log(productData);
      // Append specifications
      specifications.forEach((section, index) => {
        productData.append(`specifications[${index}][title]`, section.title);
        section.specs.forEach((spec, specIndex) => {
          productData.append(
            `specifications[${index}][specs][${specIndex}][key]`,
            spec.key
          );
          productData.append(
            `specifications[${index}][specs][${specIndex}][value]`,
            spec.value
          );
        });
      });

      console.log(productData);
      await createProduct(productData).unwrap();
      toast.success("Tạo sản phẩm thành công!");
    } catch (error) {
      toast.error("Tạo sản phẩm thất bại!");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleSpecificationChange = (sectionIndex, specIndex, key, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[sectionIndex].specs[specIndex] = {
      ...updatedSpecs[sectionIndex].specs[specIndex],
      [key]: value,
    };
    setSpecifications(updatedSpecs);
  };

  const addSpecification = (sectionIndex) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[sectionIndex].specs.push({ key: "", value: "" });
    setSpecifications(updatedSpecs);
  };

  const addSpecificationSection = () => {
    setSpecifications([
      ...specifications,
      { title: "", specs: [{ key: "", value: "" }] },
    ]);
  };

  const removeSpecification = (sectionIndex, specIndex) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[sectionIndex].specs = updatedSpecs[sectionIndex].specs.filter(
      (_, i) => i !== specIndex
    );
    setSpecifications(updatedSpecs);
  };

  const handleSectionTitleChange = (sectionIndex, title) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[sectionIndex].title = title;
    setSpecifications(updatedSpecs);
  };

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium mb-4">Thêm sản phẩm</p>
      <div className="flex justify-center items-center ">
        <div className="bg-white    rounded-lg shadow-md w-full  ">
          <div className="flex  flex-col items-center justify-center gap-8">
            <Upload
              listType="picture-card"
              fileList={fileList}
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUploadChange}
              multiple
              className="w-full md:w-2/3 bg-white p-4 mt-4 rounded-lg shadow-md"
              disabled={isLoading}
            >
              {fileList.length >= 8 ? null : (
                <div className="flex flex-col items-center justify-center">
                  <PlusOutlined />
                  <div className="mt-2">Tải hình ảnh sản phẩm</div>
                </div>
              )}
            </Upload>
            <div className="flex flex-wrap w-full md:w-2/3 gap-4 ">
              {fileList.map((file, index) => (
                <Row key={file.uid} gutter={16} className="mb-5" align="middle">
                  <Col>
                    <Image
                      src={file.url || URL.createObjectURL(file.originFileObj)}
                      style={{ width: "50px", height: "auto" }} // Adjust width here
                      preview={true}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      required={true}
                      type="text"
                      value={imageColors[file.uid] || ""}
                      onChange={(e) => handleColorChange(file, e.target.value)}
                      placeholder="Nhập tên màu"
                      style={{ width: "150px" }} // Set a specific width here
                      disabled={isLoading}
                    />
                  </Col>
                </Row>
              ))}
            </div>
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
                <p className="font-bold text-lg mb-4 sm:pl-0 ">
                  Phân loại sản phẩm
                </p>
                {variants.map((variant, index) => (
                  <Card key={index} className="mb-4 border border-sky-400">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Màu sắc"
                          className="w-full"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên màu",
                            },
                          ]}
                        >
                          <Input
                            required={true}
                            size="large"
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "color",
                                e.target.value
                              )
                            }
                            placeholder="Nhập tên màu"
                            disabled={isLoading}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Dung lượng" className="w-full">
                          <Input
                            size="large"
                            value={variant.storage}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "storage",
                                e.target.value
                              )
                            }
                            placeholder="Nhập dung lượng (e.g., 256GB, 512GB)"
                            disabled={isLoading}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Giá gốc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập giá gốc",
                            },
                          ]}
                        >
                          <Input
                            required={true}
                            size="large"
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Nhập giá gốc"
                            disabled={isLoading}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Giá khuyến mãi">
                          <Input
                            size="large"
                            type="number"
                            value={variant.discountPrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "discountPrice",
                                e.target.value
                              )
                            }
                            placeholder="Nhập giá khuyến mãi"
                            disabled={isLoading}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="Số lượng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số lượng",
                        },
                      ]}
                    >
                      <Input
                        required={true}
                        size="large"
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        placeholder="Nhập số lượng phân loại này"
                        disabled={isLoading}
                      />
                    </Form.Item>
                    <div className="flex">
                      <Button
                        size="large"
                        danger
                        onClick={() => removeVariant(index)}
                        disabled={isLoading}
                      >
                        Xoá
                      </Button>
                      <Button
                        size="large"
                        type="primary"
                        onClick={() => copyVariant(index)}
                        className="ml-2"
                        disabled={isLoading}
                      >
                        Sao chép
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={addVariant}
                  icon={<PlusOutlined />}
                  disabled={isLoading}
                >
                  Thêm phân loại
                </Button>
                <Divider />
                <div className="p-6">
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
                          disabled={isLoading}
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
                          disabled={isLoading}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
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
                          disabled={isLoading}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Mô tả"
                    className="w-full"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <ReactQuill
                      disabled={isLoading}
                      value={description}
                      onChange={setDescription}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }],
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"],
                          ["clean"],
                        ],
                      }}
                      className="w-full"
                    />
                  </Form.Item>
                </div>
                {/* Title for Specifications */}
                <div className="w-full">
                  <p className="font-bold text-lg mb-4">Thông số kỹ thuật</p>
                  {specifications.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 p-6">
                      <Input
                        required={true}
                        placeholder="Tiêu đề"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(sectionIndex, e.target.value)
                        }
                        className="w-full mb-4"
                        size="large"
                        disabled={isLoading}
                      />
                      {section.specs.map((spec, specIndex) => (
                        <Row gutter={16} key={specIndex}>
                          <Col span={10}>
                            <Input
                              required={true}
                              placeholder="Thông số"
                              value={spec.key}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  sectionIndex,
                                  specIndex,
                                  "key",
                                  e.target.value
                                )
                              }
                              className="w-full mb-2"
                              size="large"
                              disabled={isLoading}
                            />
                          </Col>
                          <Col span={10}>
                            <Input
                              required={true}
                              placeholder="Giá trị"
                              value={spec.value}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  sectionIndex,
                                  specIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="w-full mb-2"
                              size="large"
                              disabled={isLoading}
                            />
                          </Col>
                          <Col span={4}>
                            <Button
                              danger
                              onClick={() =>
                                removeSpecification(sectionIndex, specIndex)
                              }
                              className="w-full mb-2"
                              size="large"
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => addSpecification(sectionIndex)}
                        className="w-full mb-4"
                        size="large"
                        disabled={isLoading}
                      >
                        Thêm thông số
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={addSpecificationSection}
                    className="w-full mb-4"
                    size="large"
                  >
                    Thêm mục thông số
                  </Button>
                </div>
                <Form.Item className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Tạo sản phẩm
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
