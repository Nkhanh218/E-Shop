import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAllProductQuery } from "../../redux/api/productApiSlice";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import "./detail.css";
import { Button, Collapse, Radio, Tag } from "antd";
import { original } from "@reduxjs/toolkit";
import { useGetAllEventsQuery } from "../../redux/api/eventApiSlice";
import { set } from "mongoose";
import { ThunderboltTwoTone } from "@ant-design/icons";
import CountdownTimer from "../../component/customhook/CountdownTimer";

const ProductDetails = () => {
  const { productName } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const { data: products, isLoading, error } = useAllProductQuery();
  const [showSpec, setShowSpec] = useState(true);
  const [isEventProduct, setIsEventProduct] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const { data: events } = useGetAllEventsQuery();
  console.log(isEventProduct);
  const product = products?.find((p) => p.name === decodedProductName);
  console.log(product?._id);
  useEffect(() => {
    events?.forEach((event) => {
      event.products.forEach((eProduct) => {
        if (eProduct.product === product?._id) {
          setIsEventProduct(true);
          return;
        }
      });
    });
  }, [events, product]);
  const uniqueStorageOptions = Array.from(
    new Set(product?.variants.map((variant) => variant.storage).filter(Boolean))
  );
  const uniqueColorOptions = Array.from(
    new Set(product?.variants.map((variant) => variant.color).filter(Boolean))
  );

  const [selectedStorage, setSelectedStorage] = useState(
    uniqueStorageOptions[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    uniqueColorOptions[0] || ""
  );
  useEffect(() => {
    if (uniqueStorageOptions.length > 0 && !selectedStorage) {
      setSelectedStorage(uniqueStorageOptions[0]);
    }
    if (uniqueColorOptions.length > 0 && !selectedColor) {
      setSelectedColor(uniqueColorOptions[0]);
    }
  }, [uniqueStorageOptions, uniqueColorOptions]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  // Prepare images for ImageGallery
  const image = product.images

    .filter((image) => image.featuredImage == false)
    .filter((image) => image.color === selectedColor || image.color === "")

    .slice(1)
    .map((image) => ({
      thumbnail: image.url,
      original: image.url,
    }));
  const imageft = product.images
    .filter((image) => image.featuredImage === true)
    .map((image, index) => ({
      thumbnail:
        index === 0
          ? "https://res.cloudinary.com/doh7f7ja9/image/upload/v1726801596/icon-feature-active-min_z1fme6.png"
          : "", // Đặt thumbnail rỗng cho các vòng lặp sau
      original: image.url,
    }));

  const imagespl = imageft.concat(image);
  console.log(selectedStorage);
  const items = product.specifications?.map((spec) => ({
    key: spec._id,
    label: spec.title,
    children: (
      <div>
        {spec.details?.map((detail, index) => (
          <ul key={index}>
            <li className="p-4 border-b border-gray-200 grid grid-cols-2 gap-4">
              <aside className="flex-shrink-0">
                <strong>{detail.key}:</strong>
              </aside>
              <aside className="flex-1">
                <span>{detail.value}</span>
              </aside>
            </li>
          </ul>
        ))}
      </div>
    ),
  }));

  const getSelectedVariant = () => {
    return product.variants.find(
      (variant) =>
        variant.storage === selectedStorage && variant.color === selectedColor
    );
  };

  const selectedVariant = getSelectedVariant();

  const isStorageAvailableForColor = (storage) => {
    return product.variants.some(
      (variant) =>
        variant.color === selectedColor && variant.storage === storage
    );
  };
  const discountPercentage = selectedVariant?.price
    ? ((selectedVariant.price - selectedVariant.discountPrice) /
        selectedVariant.price) *
      100
    : 0;

  return (
    <div className="pt-24 px-40">
      <p className="text-black text-2xl font-semibold">{product.name}</p>

      <div className="flex pt-4">
        <div className="w-[60%]">
          <div className="bg-white w-full h-auto rounded-lg">
            <div className="custom-image-gallery px-4 py-2">
              <ImageGallery
                showIndex={true}
                showPlayButton={false}
                items={imagespl}
              />
            </div>
          </div>
          <div className="bg-white mt-4 flex flex-col items-center rounded-lg py-4">
            <div className="py-4">
              <Button
                size="large"
                className={`w-[200px] ${
                  showSpec ? "bg-blue-500 text-white" : "bg-gray-50 text-black"
                }`}
                onClick={() => {
                  setShowSpec(true);
                  setShowDescription(false);
                }}
              >
                <b>Thông số kỹ thuật</b>
              </Button>
              <Button
                size="large"
                className={`w-[200px] ml-4 ${
                  showDescription
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-black"
                }`}
                onClick={() => {
                  setShowSpec(false);
                  setShowDescription(true);
                }}
              >
                <b>Mô tả sản phẩm</b>
              </Button>
            </div>
            {showSpec && <Collapse className="w-[95%]" items={items} />}
            {showDescription && (
              <div
                className="w-[90%] p-4"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>
          <div className="bg-white mt-4 py-4 pl-4 pr-6">
            <strong>Đánh giá điện thoại {product.name}</strong>
          </div>
        </div>
        <div className="w-[40%]  ml-4">
          <div className="bg-white h-[500px]">
            <div className="pt-4 px-4 ">
              <Radio.Group
                onChange={(e) => setSelectedStorage(e.target.value)}
                value={selectedStorage}
              >
                {uniqueStorageOptions.map((storage, index) => (
                  <Radio.Button
                    key={index}
                    value={storage}
                    className="mr-2 mb-2"
                    disabled={!isStorageAvailableForColor(storage)}
                  >
                    {storage}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <div className="pt-4 px-4">
              <Radio.Group
                onChange={(e) => setSelectedColor(e.target.value)}
                value={selectedColor}
              >
                {uniqueColorOptions.map((color, index) => (
                  <Radio.Button key={index} value={color} className="mr-2 mb-2">
                    {color}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            {selectedVariant &&
              (isEventProduct ? (
                <div className="pt-4 px-4 ">
                  <p className="text-lg font-semibold ">
                    {selectedVariant.discountPrice ? (
                      <div className="bg-[#f75b00] h-[300px] rounded-lg relative">
                        <img
                          className="rounded-lg "
                          src="https://res.cloudinary.com/doh7f7ja9/image/upload/v1726844170/olgr-dt-min_bqsklc.png"
                          alt=""
                        />
                        <div className="absolute top-2 left-2 flex">
                          <div>
                            <p className="text-base text-white">
                              <ThunderboltTwoTone /> Sale Giá Rẻ Quá Bạn Ơi
                            </p>
                            <span className="text-2xl font-bold text-[#fff200] pr-2  top-0 ">
                              {selectedVariant.discountPrice.toLocaleString()}đ{" "}
                            </span>
                            <div className="text-base font-normal text-white line-through pr-2">
                              {selectedVariant.price.toLocaleString()}đ{" "}
                              <Tag color="green">
                                - {discountPercentage.toFixed(0)}%
                              </Tag>
                            </div>
                          </div>
                          <div className="">
                            {events?.map((event) => (
                              <div className="">
                                {/* <div
                                  className="absolute top-0 left-0 h-full rounded-full"
                                  style={{
                                    width: `${progressPercentage}%`,
                                    background:
                                      "linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ffcc00)",
                                  }}
                                ></div> */}
                                <div className=" text-center w-full z-30 text-sm text-black">
                                  {event?.products?.map((productft) =>
                                    productft.product === product?._id ? (
                                      <div className="text-center w-full z-30 text-sm text-black">
                                        <CountdownTimer
                                          startDate={new Date(
                                            event.startDate
                                          ).getTime()}
                                          endDate={new Date(
                                            event.endDate
                                          ).getTime()}
                                        />
                                        Còn lại{" "}
                                        {productft.maxTotalQuantity -
                                          productft.soldQuantity +
                                          "/" +
                                          productft.maxTotalQuantity}{" "}
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      `Price: ${selectedVariant.price}`
                    )}
                  </p>
                </div>
              ) : (
                <div className="pt-4 px-4 ">
                  <p className="text-lg font-semibold">
                    {selectedVariant.discountPrice ? (
                      <div>
                        <span className="text-lg font-bold text-red-600 pr-2">
                          {selectedVariant.discountPrice.toLocaleString()}đ{" "}
                        </span>
                        <span className="text-base font-normal text-gray-400 line-through pr-2">
                          {selectedVariant.price.toLocaleString()}đ
                        </span>
                        <Tag color="#f50">
                          - {discountPercentage.toFixed(0)}%
                        </Tag>
                      </div>
                    ) : (
                      `Price: ${selectedVariant.price}`
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
