import React, { useState } from 'react';
import Paginate from '../../../Components/Paginate';

const CategoryTable = ({ categories, handleEdit, handleDelete }) => {

    const [currentCategories, setCurrentCategories] = useState(1);
    const [pagePerCategory] = useState(5);
  
    const indexOfLastPage = currentCategories * pagePerCategory;
    const indexOfFirstPage = indexOfLastPage - pagePerCategory;
    const currentCat = categories.slice(indexOfFirstPage, indexOfLastPage);

    const paginate = (pageNumber) => {
        setCurrentCategories(pageNumber);
     };

  const renderedCategories = currentCat.map(category => (
    <tr key={category.id} className="py-3 px-5 border-b border-blue-gray-50">
      <td>{category.name}</td>
      <td>{category.priority}</td>
      <td>
        <button
          onClick={() => handleEdit(category)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
      </td>
      <td>
        <button
          onClick={() => handleDelete(category.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className='flex flex-col items-center'>
      <table className="w-full min-w-[640px] table-auto m-8">
        <thead className="border-b border-blue-gray-50 py-3 px-6 text-left">
          <tr>
            <th>Name</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>{renderedCategories}</tbody>
      </table>
      <Paginate 
        itemsPerPage={pagePerCategory}
        totalPosts={categories.length}
        paginate={paginate}
      />
    </div>
  );
};

export default CategoryTable;
