import React, { useState } from "react";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useAllProductQuery } from "../../redux/api/productApiSlice";
import { Tag } from "antd";
import ProductCard from "./ProductCard";

const ProductCategory = () => {
  const limit = 9; // Set the limit to 9
  const { data: categories, isLoading, error } = useFetchCategoriesQuery(limit);
  const { data: products } = useAllProductQuery();
  //   const [category, setCategory] = useState([]);

  categories?.map((category) => {
    console.log(category._id);
    products?.filter((product) => {
      if (product.category._id === category._id) {
        console.log(product);
      }
    });
  });
  return (
    <div className="px-40 bg-[#EDF2F9]">
      <div className="py-4">
        {categories?.map((category) => (
          <div key={category._id} className="mb-4 flex">
            <p className="font-bold text-xl mr-4">{category?.name}</p>
            <div className="flex">
              {products
                ?.filter((product) => product?.category?._id === category._id)
                .map((product) => (
                  <div>
                    <Tag color="gray" className="text-base">
                      {product?.brand}
                    </Tag>
                    <ProductCard productId={product._id} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
