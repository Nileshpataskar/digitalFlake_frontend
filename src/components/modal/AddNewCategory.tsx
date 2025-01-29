import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import axios from "axios";
import useSidebarStore from "@/lib/store/sidebarStore";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  image: string;
  status: string; // status is a string that can be "active" or "inactive"
}

interface AddNewCategoryProps {
  category: Category | null;
}

const AddNewCategory: React.FC<AddNewCategoryProps> = ({ category }) => {
  const { setIsOverlayVisible, setReload } = useSidebarStore();
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [categoryStatus, setCategoryStatus] = useState<string>("active");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryStatus(category.status); // Set the status if category exists
      setSelectedImage(null); // Clear the image if you're editing
    }
  }, [category]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const saveCategory = async () => {
    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("status", categoryStatus); // Append status to the formData
      if (selectedImage) {
        formData.append("image", selectedImage); // Add the new image if it's selected
      }

      const token = localStorage.getItem("token");

      if (category) {
        // Edit existing category
        await axios.patch(
          `https://digitalflake-backend-7yzm.onrender.com/category/${category._id}`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setReload((prev) => !prev);
      } else {
        // Add new category
        await axios.post(
          `https://digitalflake-backend-7yzm.onrender.com/category`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setReload((prev) => !prev);

      setIsOverlayVisible(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="w-full h-full bg-white p-8 flex flex-col gap-6">
      <div className="flex items-center">
        <ArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={() => setIsOverlayVisible(false)}
        />
        <h1 className="text-2xl font-medium ml-4">
          {category ? "Edit Category" : "Add Category"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <span className="w-full md:w-1/3">
          <div className="w-full">
            <label className="block mb-2 text-gray-600 text-lg">Category Name</label>
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border rounded-md"
            />
          </div>

          {category && (
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <label className="block mb-2 text-gray-600 text-lg">Status</label>
              <select
                value={categoryStatus}
                onChange={(e) => setCategoryStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </span>

        <div className="w-full md:w-1/2">
          <h2 className="text-lg text-gray-600 mb-2">Upload Image</h2>
          <div className="flex items-center gap-4">
            {selectedImage && (
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-md border-2"
              />
            )}
            {!selectedImage && category?.image && (
              <Image
                src={`https://digitalflake-backend-7yzm.onrender.com/${category.image}`}
                alt="Category"
                width={288}
                height={240}
                className="w-32 h-32 object-cover rounded-md border-2"
              />
            )}

            <label
              htmlFor="file-upload"
              className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer"
            >
              <ImagePlus size={50} />
              Upload Category Image
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-4">
        <Button
          variant="outline"
          className="border-gray-300"
          onClick={() => setIsOverlayVisible(false)}
        >
          Cancel
        </Button>
        <Button onClick={saveCategory} className="bg-digitalFlake hover:bg-digitalFlake rounded-3xl py-2 px-6">
          {category ? "Save Changes" : "Add Category"}
        </Button>
      </div>
    </div>
  );
};

export default AddNewCategory;
