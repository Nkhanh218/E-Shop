import React, { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import ModalCat from "../../component/Modal";
import CategoryForm from "./../../component/CategoryForm";
import axios from "axios";
import Loader from "../../component/Loader";
import { useOutletContext } from "react-router-dom";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { setHeaderTitle } = useOutletContext();

  useEffect(() => {
    setHeaderTitle(`Quản lý thể loại (${categories?.length || 0})`);
  }, [setHeaderTitle, categories]);
  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/image/upload`;

    formData.append("file", imageFile);
    formData.append("upload_preset", "uploadcategory");

    try {
      const response = await axios.post(cloudinaryUrl, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name) {
      toast.error("Tên thể loại không được để trống");
      setIsLoading(false);
      return;
    }

    const imageUrl = image ? await uploadImageToCloudinary(image) : null;

    try {
      const result = await createCategory({ name, image: imageUrl }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setImage(null);
        toast.success(`${result.name} đã được tạo.`);
        refetch(); // Refetch categories to update the list
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo thể loại lỗi, hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!updatingName) {
      toast.error("Tên thể loại không được để trống");
      setIsLoading(false);
      return;
    }

    let imageUrl = selectedCategory.image.url;

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName, image: imageUrl },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} đã được cập nhật!`);
        refetch(); // Refetch categories to update the list
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại, hãy thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    setIsLoading(true);

    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} đã được xoá.`);
        refetch(); // Refetch categories to update the list
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xoá thất bại, hãy thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-10">
      <p className="text-[#170c6b] text-2xl font-medium  mb-4">
        Quản lý thể loại
      </p>
      <div className="flex justify-center items-center  ">
        <div className="bg-white p-4 m rounded-lg shadow-lg  w-full">
          <CategoryForm
            value={name}
            setValue={setName}
            setImage={setImage}
            isLoading={isLoading}
            handleSubmit={handleCreateCategory}
          />
          <br />
          <hr />
          <div className="flex flex-wrap mt-6">
            {categories?.map((category) => (
              <div key={category._id} className="mr-3 mb-3">
                <button
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  <div className="w-32 bg-white pt-4 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 border-none hover:border-blue-500">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
                      <img
                        src={category?.image?.url}
                        alt={category.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-2 h-14 text-center">
                      <h3 className="text-sm font-medium text-gray-500 hover:text-blue-500">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          <ModalCat
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              setImage={setImage}
              handleSubmit={handleUpdateCategory}
              buttonText="Cập nhật"
              handleDelete={handleDeleteCategory}
            />
          </ModalCat>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
