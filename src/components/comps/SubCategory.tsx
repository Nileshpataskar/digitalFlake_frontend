"use client";
"use strict";

import {
  Edit2Icon,
  ListCheck,
  SearchIcon,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import AddNewSubCategory from "../modal/AddNewSubCategory";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  image?: string;
  status: string;
  categoryName: string;
}

const SubCategory = () => {
  const { isOverlayVisible, setIsOverlayVisible, setReload, reload } =
    useSidebarStore();
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [editSubCategoryData, setEditSubCategoryData] =
    useState<Category | null>(null);

  const fetchSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://digitalflake-backend-7yzm.onrender.com/subcategory",
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      console.log("Response category: ", response.data.data);
      setSubCategories(response.data.data); // Assuming response.data contains the list of categories
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
        `https://digitalflake-backend-7yzm.onrender.com/subcategory/${id}`,
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted category from the state
        setSubCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
      } else {
        console.error("Failed to delete category:", response.data);
        alert("Failed to delete category. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category. Please try again.");
    } finally {
      setReload((prev) => !prev);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [reload]);

  const handleAddNewClick = () => {
    setEditSubCategoryData(null);

    setIsOverlayVisible(true);
  };

  const handleEditClick = (category: Category) => {
    setEditSubCategoryData(category);
    setIsOverlayVisible(true); // Show the modal or form to edit
  };

  return (
    <main className="w-full h-full flex flex-col items-center z-10">
      {/* Top bar */}
      {!isOverlayVisible && (
        <div className="flex w-full justify-around pr-10">
          <span className="text-2xl flex items-center gap-4">
            <ListCheck size={30} /> <h1>SubCategory</h1>
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
                  SubCategory Name
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Category
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
              {subCategories.length > 0 ? (
                subCategories.map((category, index) => (
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
                    <TableCell className="py-4 px-4 text-gray-700 text-lg">
                      {category.categoryName}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Image
                        src={`https://digitalflake-backend-7yzm.onrender.com/${category.image}`}
                        alt=""
                        height={96}
                        width={96}
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
      {isOverlayVisible && (
        <AddNewSubCategory subcategory={editSubCategoryData} />
      )}
    </main>
  );
};

export default SubCategory;
