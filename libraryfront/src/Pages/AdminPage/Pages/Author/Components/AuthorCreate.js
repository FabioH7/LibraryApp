import React, { useState } from 'react';
import axios from 'axios';

const empty = {
    userName: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    bio: '',
    roleId: ''
  }
function AuthorCreate({handleCreate}) {
  const [user, setUser] = useState(empty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh');
    try {
        const response = await axios.post('http://localhost:5142/api/User', user, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
                RefreshToken: refreshToken
        }
    });
    setUser(empty)
    console.log('User created:', response.data);
    handleCreate(response.data)
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label className="block mb-2">
        <span className="text-gray-700">Username:</span>
        <input
          type="text"
          name="userName"
          value={user.userName}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Name:</span>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Surname:</span>
        <input
          type="text"
          name="surname"
          value={user.surname}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Email:</span>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Password:</span>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Bio:</span>
        <textarea
          name="bio"
          value={user.bio}
          onChange={handleChange}
          className="form-textarea border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Role ID:</span>
        <input
          type="number"
          name="roleId"
          value={user.roleId}
          onChange={handleChange}
          className="form-input border-2 border-blue-400 rounded mt-1 block w-full"
        />
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Create User
      </button>
    </form>
  );
}

export default AuthorCreate;
