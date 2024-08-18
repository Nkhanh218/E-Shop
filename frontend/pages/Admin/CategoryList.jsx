import React, { useState } from "react";
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

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

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
      return;
    }

    let imageUrl = selectedCategory.image.url;

    if (image) {
      imageUrl = await uploadImageToCloudinary(
        image,
        `category_${selectedCategory._id}`
      );
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

      console.log("result", result);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} đã được xoá.`);

        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xoá thất bại hãy thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row pt-32">
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-xl font-semibold mb-4">Quản Lý Thể Loại</div>
        <CategoryForm
          value={name}
          setValue={setName}
          setImage={setImage}
          isLoading={isLoading} // Pass loading state here
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />
        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id} className="m-2">
              <button
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                <div className="w-32 bg-white pt-4 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 hover:border-blue-500">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={category?.image?.url}
                      alt={category.name}
                      className="w-full h-full object-cover"
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
        <ModalCat isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            setImage={setImage} // Correctly passing setImage prop here
            handleSubmit={handleUpdateCategory}
            buttonText="Cập nhật"
            handleDelete={handleDeleteCategory}
          />
        </ModalCat>
      </div>
    </div>
  );
};

export default CategoryList;
