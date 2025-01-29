import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import axios from "axios";
import useSidebarStore from "@/lib/store/sidebarStore";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  image: string;
  status: string;
  categoryId: string;
}

interface AddNewSubCategoryProps {
  subcategory: Subcategory | null;
}

const AddNewSubCategory: React.FC<AddNewSubCategoryProps> = ({
  subcategory,
}) => {
  const { setIsOverlayVisible, setReload } = useSidebarStore();
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [categoryStatus, setCategoryStatus] = useState<string>("active");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://digitalflake-backend-7yzm.onrender.com/category",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Prefill form if editing
  useEffect(() => {
    if (subcategory) {
      setSubcategoryName(subcategory.name);
      setCategoryStatus(subcategory.status);
      setSelectedCategory(subcategory.categoryId);
      setSelectedImage(null);
    }
  }, [subcategory]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const saveSubcategory = async () => {
    if (!subcategoryName) {
      alert("Please enter a subcategory name.");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", subcategoryName);
      formData.append("categoryName", selectedCategory);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (subcategory) {
        formData.append("status", categoryStatus);
      }

      const token = localStorage.getItem("token");

      if (subcategory) {
        // Edit existing subcategory
        await axios.patch(
          `https://digitalflake-backend-7yzm.onrender.com/subcategory/${subcategory._id}`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setReload((prev) => !prev);
        toast("Subcategory edited successfully!");
      } else {
        // Add new subcategory
        await axios.post(
          `https://digitalflake-backend-7yzm.onrender.com/subcategory`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setReload((prev) => !prev);
        toast("Subcategory added successfully!");
      }

      setIsOverlayVisible(false);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      alert("Failed to save subcategory.");
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center">
        <ArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={() => setIsOverlayVisible(false)}
        />
        <h1 className="text-2xl font-medium ml-4">
          {subcategory ? "Edit Subcategory" : "Add Subcategory"}
        </h1>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subcategory Name */}
        <div>
          <label className="block mb-2 text-gray-600 text-lg">
            Subcategory Name
          </label>
          <Input
            type="text"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-2 text-gray-600 text-lg">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border rounded-md bg-white"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status (Only for Edit Mode) */}
        {subcategory && (
          <div>
            <label className="block mb-2 text-gray-600 text-lg">Status</label>
            <select
              value={categoryStatus}
              onChange={(e) => setCategoryStatus(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <h2 className="text-lg text-gray-600 mb-2">Upload Image</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {selectedImage && (
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              width={128}
              height={128}
              className="w-40 h-40 object-cover rounded-md border-2"
            />
          )}
          {!selectedImage && subcategory?.image && (
            <Image
              src={`https://digitalflake-backend-7yzm.onrender.com/${subcategory.image}`}
              alt="subcategory"
              width={128}
              height={128}
              className="w-40 h-40 object-cover rounded-md border-2"
            />
          )}

          <label
            htmlFor="file-upload"
            className="w-52 h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer"
          >
            <ImagePlus size={50} />
            Upload Subcategory Image
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

      {/* Buttons */}
      <div className="flex justify-end mt-auto gap-4">
        <Button
          variant="outline"
          className="border-gray-300"
          onClick={() => setIsOverlayVisible(false)}
        >
          Cancel
        </Button>
        <Button onClick={saveSubcategory}  className="bg-digitalFlake hover:bg-digitalFlake rounded-3xl py-2 px-6">
          {subcategory ? "Save Changes" : "Add Subcategory"}
        </Button>
      </div>
    </div>
  );
};

export default AddNewSubCategory;
