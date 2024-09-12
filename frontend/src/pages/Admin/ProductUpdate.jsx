import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Row,
  Col,
  Select,
  Image,
  Card,
  Divider,
} from "antd";
import { debounce } from "lodash";

import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

const ProductUpdate = () => {
  const params = useParams();
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetProductByIdQuery(params._id);
  const [form] = Form.useForm(); // Initialize the form instance
  const [fileList, setFileList] = useState([]);
  const [imageColors, setImageColors] = useState({});

  const [specifications, setSpecifications] = useState([]);
  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const { setHeaderTitle } = useOutletContext();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [deleteImages, setDeleteImages] = useState([]);
  const [variants, setVariants] = useState([
    { color: "", storage: "", price: 0, discountPrice: 0, stock: 0 },
  ]);
  const handleFormChange = useCallback(
    debounce((changedValues, allValues) => {
      console.log("Form values changed:", allValues);
    }, 300),
    []
  );
  useEffect(() => {
    if (productData && productData._id) {
      // Populate form fields with fetched data
      setSpecifications(
        productData.specifications.map((section) => ({
          title: section.title || "",
          specs: section.details || [], // Ensure correct mapping here
        }))
      );
      setFileList(
        productData.images.map((image) => ({
          uid: image.public_id,
          name: image.url.split("/").pop(),
          url: image.url,
          status: "done",
        }))
      );
      setImageColors(
        productData.images.reduce(
          (acc, image) => ({ ...acc, [image.public_id]: image.color || "" }),
          {}
        )
      );
      setVariants(
        productData.variants.map((variant) => ({
          color: variant.color || "",
          storage: variant.storage || "",
          price: variant.price || 0,
          discountPrice: variant.discountPrice || 0,
          stock: variant.stock || 0,
        }))
      );
    }
  }, [productData]);

  useEffect(() => {
    setHeaderTitle("Cập nhật sản phẩm");
  }, [setHeaderTitle]);

  const prcategory = useMemo(
    () => categories.map((c) => ({ value: c._id, label: c.name })),
    [categories]
  );

  const handleImageUploadChange = useCallback(({ fileList, file }) => {
    if (file.status === "removed" && file.url) {
      setDeleteImages((prev) => [...prev, file.url]);
    }
    setFileList(fileList);
  }, []);
  const uploadImageToServer = useCallback(
    async (imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("folder", "E_Shop/Product");
      try {
        const response = await uploadProductImage(formData).unwrap();
        return response.images[0];
      } catch (error) {
        console.error("Image upload failed:", error);
        return null;
      }
    },
    [uploadProductImage]
  );
  const handleVariantChange = useCallback((index, key, value) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index][key] = value;
      return updatedVariants;
    });
  }, []);

  const addVariant = useCallback(() => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { color: "", storage: "", price: 0, discountPrice: 0, stock: 0 },
    ]);
  }, []);

  const removeVariant = useCallback((index) => {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  }, []);
  const copyVariant = useCallback((index) => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { ...prevVariants[index] },
    ]);
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        let uploadedImages = [];
        const existingImages = [];

        for (let file of fileList) {
          if (file.url) {
            existingImages.push(file.url);
          } else {
            const uploadedImage = await uploadImageToServer(file.originFileObj);
            if (uploadedImage) {
              uploadedImages.push(uploadedImage.url);
            }
          }
        }

        const allImages = [...existingImages, ...uploadedImages];

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("brand", values.brand);

        allImages.forEach((url, index) => {
          const color = imageColors[fileList[index].uid] || "";
          formData.append(`images[${index}]`, url);
          formData.append(`image[${index}][color]`, color);
        });

        deleteImages.forEach((url, index) => {
          formData.append(`deleteImages[${index}]`, url || "");
        });

        specifications.forEach((section, sectionIndex) => {
          formData.append(
            `specifications[${sectionIndex}][title]`,
            section.title
          );
          section.specs.forEach((spec, specIndex) => {
            formData.append(
              `specifications[${sectionIndex}][specs][${specIndex}][key]`,
              spec.key
            );
            formData.append(
              `specifications[${sectionIndex}][specs][${specIndex}][value]`,
              spec.value
            );
          });
        });

        variants.forEach((variant, index) => {
          formData.append(`variants[${index}][color]`, variant.color);
          formData.append(`variants[${index}][storage]`, variant.storage);
          formData.append(`variants[${index}][price]`, variant.price);
          formData.append(
            `variants[${index}][discountPrice]`,
            variant.discountPrice
          );
          formData.append(`variants[${index}][stock]`, variant.stock);
        });

        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        await updateProduct({ productId: params._id, formData }).unwrap();
        setDeleteImages([]);
        toast.success("Cập nhật sản phẩm thành công!");
        refetch();
      } catch (error) {
        console.error("Update product failed:", error);
        toast.error("Cập nhật sản phẩm thất bại!");
      }
    },
    [
      fileList,
      imageColors,
      deleteImages,
      specifications,
      variants,
      updateProduct,
      params._id,
      refetch,
      uploadImageToServer,
    ]
  );

  const handleSpecificationChange = useCallback(
    (sectionIndex, specIndex, key, value) => {
      setSpecifications((prevSpecs) => {
        const updatedSpecs = [...prevSpecs];
        updatedSpecs[sectionIndex] = {
          ...updatedSpecs[sectionIndex],
          specs: updatedSpecs[sectionIndex].specs.map((spec, idx) =>
            idx === specIndex ? { ...spec, [key]: value } : spec
          ),
        };
        return updatedSpecs;
      });
    },
    []
  );

  const handleColorChange = useCallback((file, color) => {
    setImageColors((prevColors) => ({
      ...prevColors,
      [file.uid]: color,
    }));
  }, []);

  const addSpecification = useCallback((sectionIndex) => {
    setSpecifications((prevSpecs) => {
      const updatedSpecs = [...prevSpecs];
      if (updatedSpecs[sectionIndex]) {
        updatedSpecs[sectionIndex] = {
          ...updatedSpecs[sectionIndex],
          specs: [...updatedSpecs[sectionIndex].specs, { key: "", value: "" }],
        };
      }
      return updatedSpecs;
    });
  }, []);

  const addSpecificationSection = useCallback(() => {
    setSpecifications((prevSpecs) => [
      ...prevSpecs,
      { title: "", specs: [{ key: "", value: "" }] },
    ]);
  }, []);

  const removeSpecification = useCallback((sectionIndex, specIndex) => {
    setSpecifications((prevSpecs) => {
      if (
        sectionIndex < 0 ||
        sectionIndex >= prevSpecs.length ||
        specIndex < 0 ||
        specIndex >= prevSpecs[sectionIndex].specs.length
      ) {
        return prevSpecs;
      }

      const updatedSpecs = prevSpecs.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            specs: section.specs.filter((_, i) => i !== specIndex),
          };
        }
        return section;
      });

      return updatedSpecs;
    });
  }, []);

  const handleSectionTitleChange = useCallback((sectionIndex, title) => {
    setSpecifications((prevSpecs) => {
      const updatedSpecs = [...prevSpecs];
      updatedSpecs[sectionIndex].title = title;
      return updatedSpecs;
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 m-8 rounded-3xl shadow-md w-full max-w-6xl">
        <div className="flex flex-col  items-center justify-center gap-8">
          <Upload
            listType="picture-card"
            fileList={fileList}
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUploadChange}
            multiple
            className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md"
          >
            {fileList.length >= 12 ? null : (
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
                    type="text"
                    value={imageColors[file.uid] || ""}
                    onChange={(e) => {
                      console.log("Input change:", e.target.value);
                      handleColorChange(file, e.target.value);
                    }}
                    placeholder="Nhập tên màu"
                    style={{ width: "150px" }} // Set a specific width here
                  />
                </Col>
              </Row>
            ))}
          </div>
          <div className="w-full md:w-2/3">
            <Form
              onValuesChange={handleFormChange}
              form={form}
              onFinish={handleSubmit}
              name="nest-messages"
              layout="vertical"
              initialValues={{
                name: productData?.name,
                brand: productData?.brand,
                category: productData?.category,
                description: productData?.description,
              }}
              className="w-full"
            >
              <p className="font-bold text-lg mb-4">Phân loại sản phẩm</p>
              {variants.map((variant, index) => (
                <Card key={index} className="mb-4 border border-sky-400">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Màu sắc" className="w-full">
                        <Input
                          required={true}
                          size="large"
                          value={variant.color}
                          onChange={(e) =>
                            handleVariantChange(index, "color", e.target.value)
                          }
                          placeholder="Nhập tên màu"
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
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Giá gốc">
                        <Input
                          required={true}
                          size="large"
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          placeholder="Nhập giá gốc"
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
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Số lượng">
                    <Input
                      size="large"
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(index, "stock", e.target.value)
                      }
                      placeholder="Nhập số lượng phân loại này"
                    />
                  </Form.Item>
                  <Button
                    size="large"
                    danger
                    onClick={() => removeVariant(index)}
                  >
                    Xoá phân loại
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => copyVariant(index)}
                    className="ml-2"
                  >
                    Sao chép dữ liệu
                  </Button>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={addVariant}
                icon={<PlusOutlined />}
              >
                Thêm phân loại
              </Button>
              <Divider />
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
                    <Input size="large" className="w-full" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <p className="pb-2">Danh mục</p>
                  <Form.Item
                    name="category"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className="w-full"
                  >
                    <Select
                      showSearch
                      placeholder="Chọn danh mục"
                      size="large"
                      defaultValue={productData?.category?._id}
                      options={prcategory}
                      className="w-full"
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
                    <Input size="large" className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    className="w-full"
                  >
                    <ReactQuill theme="snow" />
                  </Form.Item>
                </Col>
              </Row>

              {specifications.map((section, sectionIndex) => (
                <div key={sectionIndex} className="pb-4">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Input
                        // required={true}
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(sectionIndex, e.target.value)
                        }
                        placeholder="Tiêu đề"
                        size="large"
                        className="w-full"
                      />
                    </Col>
                  </Row>
                  {(section.specs || []).map((spec, specIndex) => (
                    <Row gutter={16} key={specIndex} className="pt-4">
                      <Col span={10}>
                        <Input
                          required={true}
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecificationChange(
                              sectionIndex,
                              specIndex,
                              "key",
                              e.target.value
                            )
                          }
                          placeholder="Thông số"
                          size="large"
                          className="w-full"
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          required={true}
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecificationChange(
                              sectionIndex,
                              specIndex,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Giá trị"
                          size="large"
                          className="w-full"
                        />
                      </Col>
                      {section.specs.length > 0 && (
                        <Col span={4}>
                          <Button
                            danger
                            size="large"
                            className="w-full mb-2"
                            onClick={() =>
                              removeSpecification(
                                sectionIndex,
                                section.specs.length - 1
                              )
                            }
                          >
                            Xóa
                          </Button>
                        </Col>
                      )}
                    </Row>
                  ))}
                  <div className="pt-4 flex justify-between">
                    <Button
                      type="dashed"
                      onClick={() => addSpecification(sectionIndex)}
                    >
                      Thêm thông số
                    </Button>
                    {/* Here we are passing the correct specIndex */}
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={addSpecificationSection}
                className="w-full"
                size="large"
              >
                Thêm mục thông số
              </Button>

              <Form.Item className="mt-8">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full"
                >
                  Cập nhật sản phẩm
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
