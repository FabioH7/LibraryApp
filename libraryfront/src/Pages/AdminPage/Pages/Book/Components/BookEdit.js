import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const BookEdit = ({ book, handleUpdate }) => {
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    getData()
    setTitle(book.title);
    setDescription(book.description);
    setAuthor(authors.find((author) => author.id === book.authorId));
    setSelectedCategories(getCategories());
  }, [book]);

  
  const getData = async () => {
      await axios.get('http://localhost:5142/api/User').then((response) => {
                setAuthors(response.data)
            })
            
            await axios.get('http://localhost:5142/api/Category').then((response) => {
                setCategories(response.data)
            })
        }
        
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
        formData.append('title', title);
        formData.append('description', description);
        formData.append('authorId', author.value);

        selectedCategories.forEach((category) => {
            formData.append('categoryIds[]', category.value);
        });

        formData.append('cover', cover);

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refresh');
            const response = await axios.put(
                        `http://localhost:5142/api/Book/${book.id}`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                    RefreshToken: refreshToken,
                },
            })
            console.log(response.data)
            handler(response.data);
        } catch (error) {
            console.error(error.data);
        }
};

const handler = (data) => {
    console.log("handler", data)
    handleUpdate(data)
}

const authorOptions = authors.map((author) => ({
    value: author.id,
    label: `${author.name} ${author.surname}`,
}));

const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
}));

const getCategories = () => {
  let categoryIds = []
  for (const cat of book.categories) {
      const idCat = categoryOptions.find(c => c.label === cat)
      categoryIds.push(idCat)
  }
  return categoryIds
}

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
      <button type="submit">Update Book</button>
    </form>
  );
};

export default BookEdit;
