import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  useAllProductQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../component/Loader";
import { Link, useOutletContext } from "react-router-dom";
import { Button, Modal, Popconfirm, Space, Table } from "antd";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { setHeaderTitle } = useOutletContext();
  const { data: products, isLoading, isError, refetch } = useAllProductQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] =
    useState(false);
  const [isSpecsModalVisible, setIsSpecsModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  console.log(products);
  useEffect(() => {
    setHeaderTitle(`Tất cả sản phẩm (${products?.length || 0})`);
  }, [setHeaderTitle, products]);

  const confirm = async (id) => {
    try {
      console.log(`Deleting product with id: ${id}`);
      const response = await deleteProduct(id).unwrap();
      console.log("Delete response:", response);
      toast.success("Sản phẩm đã được xoá thành công!");
      refetch();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(err?.data?.message || err.error || "Lỗi xoá sản phẩm");
    }
  };

  const showDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsDescriptionModalVisible(true);
  };

  const showSpecsModal = (specifications) => {
    setSelectedSpecifications(specifications);
    setIsSpecsModalVisible(true);
  };

  const handleDescriptionCancel = () => {
    setIsDescriptionModalVisible(false);
    setSelectedDescription("");
  };

  const handleSpecsCancel = () => {
    setIsSpecsModalVisible(false);
    setSelectedSpecifications([]);
  };

  // Prepare data for the table
  const productData = products?.map((product) => {
    const totalStock = product.variants.reduce(
      (acc, variant) => acc + variant.stock,
      0
    );
    const prices = product.variants.map((variant) => variant.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return {
      key: product._id,
      name: product.name,
      images: product.images.map((img) => ({
        url: img.url,
        id: img.public_id,
      })),
      quantity: totalStock,
      category: product.category.name || "Không có danh mục",
      description: product.description,
      priceRange: `${minPrice.toLocaleString()}  - ${maxPrice.toLocaleString()} `,
      createdAt: moment(product.createdAt).format("DD/MM/YYYY"),
      specifications: product.specifications,
    };
  });
  console.log(productData);
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "50px",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => {
        const imageLimit = 1; // Limit the number of images displayed initially
        const initialImages = images.slice(0, imageLimit);
        const hasMoreImages = images.length > imageLimit;

        return (
          <div className="flex flex-wrap gap-2">
            {initialImages.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt="Product"
                className="w-16 h-16 object-cover rounded-md"
                onClick={() =>
                  window.open(
                    `https://console.cloudinary.com/console/c-8142f3ff8dc896e206dc77d59ca2c0/media_library/search?q={"userQuery":["${img.id}"]}&view_mode=mosaic`,
                    "_blank"
                  )
                }
              />
            ))}
            {hasMoreImages && (
              <button
                className="text-blue-500 underline"
                onClick={() => {
                  setModalImages(images);
                  setIsImageModalVisible(true);
                }}
              >
                Xem tất cả
              </button>
            )}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "50px",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "50px",

      render: (text) => (
        <a onClick={() => showDescriptionModal(text)}>
          <p className="text-sky-500 font-bold">(Xem chi tiết)</p>
        </a>
      ),
    },
    {
      title: "Giá",
      dataIndex: "priceRange",
      key: "priceRange",
      width: "50px",
    },
    {
      title: "Thông số kỹ thuật",
      dataIndex: "specifications",
      key: "specifications",
      render: (specifications) => (
        <a onClick={() => showSpecsModal(specifications)}>
          {specifications.length > 0 ? (
            <p className="text-sky-500 font-bold">(Xem chi tiết)</p>
          ) : (
            "Không có thông số"
          )}
        </a>
      ),
      width: "50px",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành Động",
      key: "action",

      render: (_, product) => (
        <div className="space-y-2 w-16">
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn có chắc chắn muốn xoá sản phẩm này?"
            onConfirm={() => confirm(product.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger loading={isDeleting} className="w-full">
              Xoá
            </Button>
          </Popconfirm>
          <Link to={`/admin/san-pham/cap-nhat-san-pham/${product.key}`}>
            <Button className="w-full mt-5" type="primary">
              Cập nhật
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <div>Lỗi tải sản phẩm</div>;

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium mb-4">
        Tất cả sản phẩm({products?.length || 0})
      </p>
      <div className="flex justify-center items-center ">
        <div className="bg-white rounded-lg  shadow-lg w-full">
          <Table
            className="custom-table lg:w-full w-[600px]"
            dataSource={productData}
            columns={columns}
            rowKey="key"
            pagination={{ pageSize: 4 }}
            scroll={{ x: "max-content" }}
          />
        </div>

        {/* Modal for Description */}
        <Modal
          width={800}
          title="Mô tả sản phẩm"
          visible={isDescriptionModalVisible}
          onCancel={handleDescriptionCancel}
          footer={null}
        >
          <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
        </Modal>

        {/* Modal for Specifications */}
        <Modal
          title="Thông số kỹ thuật"
          visible={isSpecsModalVisible}
          onCancel={handleSpecsCancel}
          footer={null}
        >
          {selectedSpecifications.length > 0 ? (
            <div className="space-y-4">
              {selectedSpecifications.map((spec, index) => (
                <div key={index}>
                  <div className="font-bold">{spec.title}</div>
                  <div className="whitespace-pre-line">
                    {spec.details.map((detail, i) => (
                      <div key={i}>{`${detail.key}: ${detail.value}`}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có thông số kỹ thuật nào.</p>
          )}
        </Modal>

        {/* Modal for Viewing All Images */}
        <Modal
          title="Tất cả hình ảnh"
          visible={isImageModalVisible}
          onCancel={() => setIsImageModalVisible(false)}
          footer={null}
        >
          <div className="flex flex-wrap gap-2">
            {modalImages.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt="Product"
                className="w-16 h-16 object-cover rounded-md"
                onClick={() =>
                  window.open(
                    `https://console.cloudinary.com/console/c-8142f3ff8dc896e206dc77d59ca2c0/media_library/search?q={"userQuery":["${img.id}"]}&view_mode=mosaic`,
                    "_blank"
                  )
                }
              />
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllProducts;
