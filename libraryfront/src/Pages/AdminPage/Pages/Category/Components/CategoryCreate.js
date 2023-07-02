import React, { useState } from 'react';
import axios from 'axios';

const emptyCategory = {
  name: '',
  priority: ''
};

function CategoryCreate({ handleCreate }) {
  const [category, setCategory] = useState(emptyCategory);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh');
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5142/api/Category', category, {
        headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken
    }});
      setCategory(emptyCategory);
      console.log('Category created:', response.data);
      handleCreate(response.data);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value
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
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Create Category
      </button>
    </form>
  );
}

export default CategoryCreate;
