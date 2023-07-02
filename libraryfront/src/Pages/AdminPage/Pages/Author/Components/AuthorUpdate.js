import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuthorUpdate({ user, update }) {
  const [xUser, setxUser] = useState(user)

  useEffect(() => {
    if (user) {
      // setUser(user)
      setxUser(user)
      console.log("ktu", user)
    }
  }, [user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      Name: xUser.name,
      Surname: xUser.surname,
      UserName: xUser.name,
      Email: xUser.email,
      Password: xUser.password,
      Bio: xUser.bio,
      RoleId: xUser.roleId
    };
    console.log(xUser.password)
    try {
      console.log(updatedUser)
      const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.put(`http://localhost:5142/api/User/${user.id}`, updatedUser, {headers : {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken
        }});
      console.log('User updated:', response.data);
      // Reset form values
        setxUser(null)
      update(response.data)
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleChange = (e) => {
    console.log('here', xUser)
    const { name, value } = e.target;
    setxUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label className="block mb-2">
        <span className="text-gray-700">Name:</span>
        <input type="text" name='name' value={xUser.name} onChange={(e) => handleChange(e)} className="form-input border-2 border-blue-400 rounded mt-1 block w-full" />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Surname:</span>
        <input type="text" name='surname' value={xUser.surname} onChange={(e) =>  handleChange(e)} className="form-input border-2 border-blue-400 rounded mt-1 block w-full" />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Email:</span>
        <input type="email" name='email' value={xUser.email} onChange={(e) =>  handleChange(e)} className="form-input mt-1 border-2 border-blue-400 rounded block w-full" />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Password:</span>
        <input type="password" name='password' value={xUser.password} onChange={(e) => handleChange(e)} className="form-input border-2 border-blue-400 rounded mt-1 block w-full" />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Bio:</span>
        <textarea value={xUser.bio} name='bio' onChange={(e) =>  handleChange(e)} className="form-textarea border-2 border-blue-400 rounded mt-1 block w-full" />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Role ID:</span>
        <input type="number" name='roleId' value={xUser.roleId} onChange={(e) =>  handleChange(e)} className="form-input border-2 border-blue-400 rounded mt-1 block w-full" />
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Update User</button>
    </form>
  );
}

export default AuthorUpdate;