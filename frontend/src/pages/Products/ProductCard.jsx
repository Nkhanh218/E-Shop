import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  EyeFilled,
  HeartFilled,
  ShoppingFilled,
  StarFilled,
  ThunderboltTwoTone,
} from "@ant-design/icons";
import { Tag } from "antd";
import { useGetProductByIdQuery } from "../../redux/api/productApiSlice";

const ProductCard = ({
  productId,
  fastList,
  saleList,
  maxTotalQuantity,
  soldQuantity,
}) => {
  const { data: product } = useGetProductByIdQuery(productId);
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleLike = () => setLiked(!liked);
  const toggleFastSee = () => setOpen(!open);

  const discountPercentage = product?.variants?.[0]?.price
    ? ((product.variants[0].price - product.variants[0].discountPrice) /
        product.variants[0].price) *
      100
    : 0;

  const progressPercentage =
    soldQuantity === 0
      ? 100
      : maxTotalQuantity
      ? ((maxTotalQuantity - soldQuantity) / maxTotalQuantity) * 100
      : 0;

  const maxNameLength = 60;
  const truncatedProductName =
    product?.name?.length > maxNameLength
      ? product.name.substring(0, maxNameLength) + "..."
      : product?.name;
  const productNameForUrl = encodeURIComponent(product?.name);

  return (
    <div className="md:w-52 h-full">
      {open && (
        <div className="fast-see-content">
          <ProductDetailCard open={open} setOpen={setOpen} data={product} />
        </div>
      )}
      <div className="flex flex-col items-center h-full bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="h-48 overflow-hidden p-2">
          <img
            src={product?.images?.[0]?.url || "placeholder-image-url"}
            alt={product?.name || "Product image"}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow justify-between">
          {product && (
            <Link
              to={`/san-pham/${productNameForUrl}`}
              className="no-underline"
            >
              <h3 className="mb-2 text-sm overflow-hidden text-ellipsis h-14">
                {truncatedProductName}
              </h3>
              <div className="lg:flex lg:justify-between lg:items-center">
                <span className="text-lg font-semibold text-red-600">
                  {maxTotalQuantity === soldQuantity
                    ? product.variants[0].price.toLocaleString() + "đ"
                    : product.variants[0].discountPrice.toLocaleString() + "đ"}
                </span>
                {product.variants[0].price !== 0 &&
                  maxTotalQuantity !== soldQuantity && (
                    <Tag color="#f50">- {discountPercentage.toFixed(0)}%</Tag>
                  )}
              </div>
              <p className="mt-2 text-sm font-semibold text-red-500">
                {product.rating} <StarFilled />
              </p>
            </Link>
          )}

          {fastList && (
            <div className="mt-auto flex justify-around pt-4">
              <HeartFilled
                onClick={toggleLike}
                style={{ fontSize: "20px", color: liked ? "red" : "" }}
                title="Add to Favourite List"
              />
              <EyeFilled
                style={{ fontSize: "20px" }}
                title="Fast See"
                onClick={toggleFastSee}
              />
              <ShoppingFilled
                style={{ fontSize: "20px" }}
                onClick={toggleFastSee}
              />
            </div>
          )}
        </div>
        {saleList && (
          <div className="w-full px-4 pb-4">
            {maxTotalQuantity === soldQuantity ? (
              <div className="font-bold text-red-600">Hết Deal </div>
            ) : (
              <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-visible">
                <ThunderboltTwoTone
                  className="absolute left-0 h-full flex items-center z-20"
                  style={{
                    color: "#ff8c00",
                    fontSize: 25,
                    top: "-2px",
                    left: 0,
                  }}
                />
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${progressPercentage}%`,
                    background:
                      "linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ffcc00)",
                  }}
                ></div>
                <div className="relative text-center w-full z-30 text-sm text-black">
                  Còn lại {maxTotalQuantity - soldQuantity}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
