"use client";
"use strict";

import { Edit2Icon, LayoutGrid, SearchIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AddNewCategory from "../modal/AddNewCategory";
import useSidebarStore from "@/lib/store/sidebarStore";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  _id: string;
  id: number;
  name: string;
  image?: string;
  status: string;
}

const Category = () => {
  const { isOverlayVisible, setIsOverlayVisible, reload, setReload } =
    useSidebarStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(
    null
  );

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

      console.log("Response category: ", response.data.data);
      setCategories(response.data.data); // Assuming response.data contains the list of categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }

    try {
      const token = localStorage.getItem("token"); // Use token for authorization
      const response = await axios.delete(
        `https://digitalflake-backend-7yzm.onrender.com/category/${id}`,
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted category from the state
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
      } else {
        console.error("Failed to delete category:", response.data);
        alert("Failed to delete category. Please try again.");
      }

      toast("Category deleted...");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast("Failed to delte category...");
    } finally {
      setReload((prev) => !prev);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [reload]);

  const handleAddNewClick = () => {
    setEditCategoryData(null);
    setIsOverlayVisible(true);
  };

  const handleEditClick = (category: Category) => {
    setEditCategoryData(category);
    setIsOverlayVisible(true); // Show the modal or form to edit
  };

  return (
    <main className="w-full h-full flex flex-col items-center z-10">
      {/* Top bar */}
      {!isOverlayVisible && (
        <div className="flex w-full justify-around pr-10">
          <span className="text-2xl flex items-center gap-4">
            <LayoutGrid size={30} /> <h1>Category</h1>
          </span>
          <div className="relative w-[600px]">
            <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full"
            />
          </div>
          <Button
            onClick={handleAddNewClick}
            className="bg-digitalFlake hover:bg-digitalFlake/90 text-lg rounded-3xl"
          >
            Add New
          </Button>
        </div>
      )}

      {!isOverlayVisible && (
        <div className="w-full px-10 mt-6">
          <Table className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px] text-left font-semibold text-gray-600">
                  ID
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Category Name
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Image
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Status
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <TableRow
                    key={index}
                    className={`hover:bg-gray-50 transition duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="py-4 px-4 text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 text-lg">
                      {category.name}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Image
                        src={
                          category?.image
                            ? `https://digitalflake-backend-7yzm.onrender.com/${category.image}`
                            : "https://rakanonline.com/wp-content/uploads/2022/08/default-product-image.png" // Replace with your actual placeholder image
                        }
                        alt={category.name}
                        width={96}
                        height={96}
                        className="w-24 h-20 object-cover rounded-md border border-gray-200"
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 capitalize text-lg">
                      <span
                        className={`px-4 py-2 rounded-full text-lg font-medium ${
                          category.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition duration-200"
                          title="Edit"
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit2Icon size={20} />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition duration-200"
                          title="Delete"

                          onClick={() => deleteCategory(category._id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-500"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Full-screen overlay */}
      {isOverlayVisible && <AddNewCategory category={editCategoryData} />}
    </main>
  );
};

export default Category;
