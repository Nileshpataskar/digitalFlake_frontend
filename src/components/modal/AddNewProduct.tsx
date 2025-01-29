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
  categoryId: string;
}

interface Product {
  _id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  image: string;
}

interface AddNewProductProps {
  product?: Product | null;
}

const AddNewProduct: React.FC<AddNewProductProps> = ({ product }) => {
  const { setIsOverlayVisible, setReload } = useSidebarStore();
  const [productName, setProductName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://digitalflake-backend-7yzm.onrender.com/category",
          {
            headers: { Authorization: ` ${token}` },
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
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://digitalflake-backend-7yzm.onrender.com/subcategory?categoryId=${selectedCategory}`,
            {
              headers: { Authorization: ` ${token}` },
            }
          );
          setSubcategories(response.data.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubcategories();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setSelectedCategory(product.categoryId);
      setSelectedSubcategory(product.subcategoryId);
    }
  }, [product]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };
  const saveProduct = async () => {
    if (!productName) {
      alert("Please enter a product name.");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }
    if (!selectedSubcategory) {
      alert("Please select a subcategory.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("category", selectedCategory); // Convert to JSON string
      formData.append("subCategory", selectedSubcategory); // Convert to JSON string
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const token = localStorage.getItem("token");

      if (product) {
        // Edit existing product
        await axios.patch(
          `https://digitalflake-backend-7yzm.onrender.com/product/${product._id}`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast("Product updated successfully!");
      } else {
        // Add new product
        await axios.post(
          `https://digitalflake-backend-7yzm.onrender.com/product`,
          formData,
          {
            headers: {
              Authorization: ` ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast("Product added successfully!");
      }

      setReload((prev) => !prev);
      setIsOverlayVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
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
          {product ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 text-gray-600 text-lg">
            Product Name
          </label>
          <Input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-2 text-gray-600 text-lg">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory(""); // Reset subcategory on category change
            }}
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

        {/* Subcategory Dropdown */}
        <div>
          <label className="block mb-2 text-gray-600 text-lg">
            Subcategory
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full p-3 border rounded-md bg-white"
          >
            <option value="">Select a Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory.name}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
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
              className="w-72 h-60 object-cover rounded-md border-2"
            />
          )}
          <label
            htmlFor="file-upload"
            className="w-52 h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer"
          >
            <ImagePlus size={50} />
            Upload Product Image
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
        <Button variant="outline" onClick={() => setIsOverlayVisible(false)}>
          Cancel
        </Button>
        <Button onClick={saveProduct}>
          {product ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </div>
  );
};

export default AddNewProduct;
