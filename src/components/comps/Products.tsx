"use client";
"use strict";

import { Edit2Icon, LayoutGrid, SearchIcon, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import AddNewProduct from "../modal/AddNewProduct";
import Image from "next/image";

interface Product {
  _id: string;
  id: number;
  name: string;
  image?: string;
  price: number;
  status: string;
  categoryId: string;
  subcategoryId: string;
}

const Product = () => {
  const { isOverlayVisible, setIsOverlayVisible, reload, setReload } =
    useSidebarStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductData, setEditProductData] = useState<
    Product | null | undefined
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://digitalflake-backend-7yzm.onrender.com/product",
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      console.log("Response products: ", response.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://digitalflake-backend-7yzm.onrender.com/product/${id}`,
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        toast("Product deleted successfully!");
      } else {
        toast("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast("Failed to delete product.");
    } finally {
      setReload((prev) => !prev);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [reload]);

  const handleAddNewClick = () => {
    setEditProductData(undefined);
    setIsOverlayVisible(true);
  };

  const handleEditClick = (product: Product) => {
    setEditProductData(product);
    setIsOverlayVisible(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full h-full flex flex-col items-center z-10">
      {/* Top bar */}
      {!isOverlayVisible && (
        <div className="flex w-full justify-around pr-10">
          <span className="text-2xl flex items-center gap-4">
            <LayoutGrid size={30} /> <h1>Products</h1>
          </span>
          <div className="relative w-[600px]">
            <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  Product Name
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Image
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Category
                </TableHead>
                <TableHead className="text-left font-semibold text-gray-600">
                  Subcategory
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TableRow
                    key={product._id}
                    className={`hover:bg-gray-50 transition duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="py-4 px-4 text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 text-lg">
                      {product.name}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Image
                        src={
                          product?.image
                            ? `https://digitalflake-backend-7yzm.onrender.com/${product.image}`
                            : "https://rakanonline.com/wp-content/uploads/2022/08/default-product-image.png"
                        }
                        alt={product.name}
                        width={100}
                        height={80}
                        className="w-24 h-20 object-cover rounded-md border border-gray-200"
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 text-lg">
                      {product.categoryId}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 text-lg">
                      {product.subcategoryId}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-700 capitalize text-lg">
                      <span
                        className={`px-4 py-2 rounded-full text-lg font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition duration-200"
                          title="Edit"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit2Icon size={20} />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition duration-200"
                          title="Delete"
                          onClick={() => deleteProduct(product.id)}
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
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isOverlayVisible && <AddNewProduct product={editProductData ?? null} />}
    </main>
  );
};

export default Product;
