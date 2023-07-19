import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../Contexts/authContext";
import Swal from "sweetalert2";

const empty = {
  userName: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  bio: "",
  roleId: 2,
  createdBy: "",
};
function AuthorCreate({ handleCreate }) {
  const [userCreate, setUserCreate] = useState(empty);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setUserCreate((prevUser) => ({
      ...prevUser,
      ["createdBy"]: user.username,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");

    try {
      var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
      if (!userCreate.password.match(paswd)) {
        throw "Password must include one uppercase , one lowercase character, one number and one special character";
      }
      const response = await axios.post(
        "http://localhost:5142/api/User",
        userCreate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken,
          },
        }
      );
      setUserCreate(empty);
      console.log("User created:", response.data);
      handleCreate(response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Author Created Succesfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCreate((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label className="block mb-2">
        <span className="text-gray-700">Username:</span>
        <input
          type="text"
          name="userName"
          value={userCreate.userName}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Name:</span>
        <input
          type="text"
          name="name"
          value={userCreate.name}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Surname:</span>
        <input
          type="text"
          name="surname"
          value={userCreate.surname}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Email:</span>
        <input
          type="email"
          name="email"
          value={userCreate.email}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Password:</span>
        <input
          type="password"
          name="password"
          value={userCreate.password}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Bio:</span>
        <textarea
          name="bio"
          value={userCreate.bio}
          onChange={handleChange}
          className="form-textarea border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Create User
      </button>
    </form>
  );
}

export default AuthorCreate;
