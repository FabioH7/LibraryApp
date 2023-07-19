import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function CategoryUpdate({ category, update }) {
  const [updatedCategory, setUpdatedCategory] = useState(category);

  useEffect(() => {
    if (category) {
      setUpdatedCategory(category);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    try {
      const response = await axios.put(
        `http://localhost:5142/api/Category/${category.id}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken,
          },
        }
      );
      console.log("Category updated:", response.data);
      setUpdatedCategory(null);
      update(response.data);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Category updated Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.title,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label className="block mb-2">
        <span className="text-gray-700">Name:</span>
        <input
          type="text"
          name="name"
          value={updatedCategory.name}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Priority:</span>
        <input
          type="text"
          name="priority"
          value={updatedCategory.priority}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Update Category
      </button>
    </form>
  );
}

export default CategoryUpdate;
