import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../Contexts/authContext";
import Swal from "sweetalert2";

const emptyCategory = {
  name: "",
  priority: "",
  createdBy: "",
  premium: false,
};

function CategoryCreate({ handleCreate }) {
  const [category, setCategory] = useState(emptyCategory);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setCategory((prevCategory) => ({
      ...prevCategory,
      ["createdBy"]: user.username,
    }));
  }, []);

  console.log(category.premium);
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5142/api/Category",
        category,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken,
          },
        }
      );
      setCategory(emptyCategory);
      handleCreate(response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Category created Successfully!",
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
    setCategory((prevCategory) => ({
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
          value={category.name}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Priority:</span>
        <input
          type="text"
          name="priority"
          value={category.priority}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Premium:</span>
        <input
          id="premium"
          type="radio"
          name="premium"
          value={true}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
        <input
          id="premium"
          type="radio"
          name="premium"
          value={false}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Create Category
      </button>
    </form>
  );
}

export default CategoryCreate;
