import React, { useEffect, useState } from "react";
import CategoryTable from "./Components/CategoryTable";
import Modal from "../../Components/Modal";
import axios from "axios";
import CategoryUpdate from "./Components/CategoryUpdate";
import CategoryCreate from "./Components/CategoryCreate";
import Swal from "sweetalert2";

export default function Category() {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    showPremium ? getPremiumCategories() : getCategories();
  }, [showPremium]);

  const getPremiumCategories = async () => {
    const response = await axios.get(
      "http://localhost:5142/api/Category/premium"
    );
    setCategories(response.data);
    console.log(response.data);
  };

  const getCategories = async () => {
    const response = await axios.get("http://localhost:5142/api/Category");
    setCategories(response.data);
    console.log(response.data);
  };

  const handleSubmit = (e) => {
    setCategories([...categories, e]);
    setCreateModal(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    const response = await axios
      .delete(`http://localhost:5142/api/Category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Category deleted Successfull!",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.title,
        });
      });
    console.log(response);

    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleEdit = async (updatedCategory) => {
    setEditModal(true);
    setCategory(updatedCategory);
  };

  const handleEditSubmit = async (cat) => {
    // Handle the update logic here
    setEditModal(false);
    setCategory(null);
    setCategories([...categories.filter((c) => c.id !== cat.id), cat]);
    // Perform the update operation and update the categories state
  };

  const handleClose = () => {
    setCreateModal(false);
    setEditModal(false);
    setCategory(null);
  };

  return (
    <div className="my-3 p-4 ml-80 mr-5 grid gap-7 relative flex flex-col rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 overflow-hidden xl:col-span-2">
      <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
        <p className="text-xl">Categories Management</p>
        <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setCreateModal(true)}
        >
          Create new category
        </button>
        <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowPremium(true)}
        >
          Show Premium Categories
        </button>
      </div>

      {createModal ? (
        <Modal label={"Create Category"} close={handleClose}>
          <CategoryCreate handleCreate={handleSubmit} />
        </Modal>
      ) : null}

      {editModal ? (
        <Modal label={"Edit Category"} close={handleClose}>
          <CategoryUpdate category={category} update={handleEditSubmit} />
        </Modal>
      ) : null}

      <CategoryTable
        categories={categories}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {showPremium ? (
        <button
          className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowPremium(false)}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}
