import React, { useContext, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "../../../../../Contexts/authContext";
import Swal from "sweetalert2";

const BookCreate = ({ authors, categories, handleCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cover, setCover] = useState(null);
  const { user } = useContext(AuthContext);

  const handleAuthorChange = (selectedOption) => {
    setAuthor(selectedOption);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleCoverChange = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorId", author.value);
    selectedCategories.forEach((category) => {
      formData.append("categoryIds", category.value);
    });
    formData.append("cover", cover);
    formData.append("createdBy", user.username);

    try {
      // Make POST request to create book
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh");
      const response = await axios.post(
        "http://localhost:5142/api/Book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken,
          },
        }
      );
      console.log(response.data);
      handleCreate(response.data.id);
      Swal.fire({
        icon: "success",
        title: "Great Success!",
        text: "Book created Successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create book!",
      });
    }
  };

  const authorOptions = authors.map((author) => ({
    value: author.id,
    label: `${author.name} ${author.surname}`,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label className="block mb-2">
        <span className="text-gray-700">Title:</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Description:</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Author:</span>
        <Select
          value={author}
          options={authorOptions}
          onChange={handleAuthorChange}
          isClearable
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Categories:</span>
        <Select
          value={selectedCategories}
          options={categoryOptions}
          onChange={handleCategoryChange}
          isMulti
          isClearable
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Cover:</span>
        <input
          type="file"
          onChange={handleCoverChange}
          required
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
        {cover ? (
          <img
            src={URL.createObjectURL(cover)}
            alt="Chosen Preview"
            className="text-white h-20 w-40 object-cover"
          />
        ) : null}
      </label>
      <button type="submit">Create Book</button>
    </form>
  );
};

export default BookCreate;
