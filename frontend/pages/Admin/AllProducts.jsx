import React, { useEffect } from "react";
import moment from "moment";
import { useAllProductQuery } from "../../redux/api/productApiSlice";
import Loader from "../../component/Loader";
import { useOutletContext } from "react-router-dom";
import { Table } from "antd";

const AllProducts = () => {
  const { setHeaderTitle } = useOutletContext();

  const { data: products, isLoading, isError } = useAllProductQuery();

  useEffect(() => {
    setHeaderTitle(`Tất cả sản phẩm (${products?.length || 0})`);
  }, [setHeaderTitle, products]);

  const productData = products?.map((product) => ({
    key: product._id,
    name: product.name,
    images: product.images.map((img) => img.url),
    quantity: product.quantity,
    category: product.category,
    description: product.description,
    price: product.price,
    createdAt: moment(product.createdAt).format("DD/MM/YYYY"),
  }));

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Product"
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <div>Lỗi tải sản phẩm</div>;

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-6xl w-full">
        <Table
          className="custom-table"
          dataSource={productData}
          columns={columns}
          rowKey="key"
        />
      </div>
    </div>
  );
};

export default AllProducts;
