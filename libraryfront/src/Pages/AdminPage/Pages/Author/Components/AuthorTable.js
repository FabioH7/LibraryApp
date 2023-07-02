import React, { useEffect, useState } from 'react'
import Paginate from '../../../Components/Paginate';

export default function AuthorTable({authors, Delete, edit}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(5);

  // Get current authors
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
    

    const renderedAuthors = currentAuthors.map((a) => {
        return (
        <tr key={a.id} className='py-3 px-5 border-b border-blue-gray-50'>
            <td>{a.name}</td>
            <td>{a.surname}</td>
            <td>{a.email}</td>
            <td>{a.bio}</td>
            <td>
                <button onClick={() => {
                        edit(a)
                    }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Edit</button>
            </td>
            <td>
                <button onClick={() => {
                    console.log(a, a.id)
                    Delete(a.id)
                    }} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Delete</button>
            </td>
        </tr>
    )
    })
  return (
    <div className='flex flex-col items-center'>

        <table className='w-full min-w-[640px] table-auto m-8 mx-auto'>
            <thead className='border-b border-blue-gray-50 py-3 px-6 text-left'>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Bio</th>
            </thead>
            <tbody className=''>
                {renderedAuthors}
                
            </tbody>
        </table>
        <Paginate 
            itemsPerPage={authorsPerPage}
            totalPosts={authors.length}
            paginate={paginate}
        />
    </div>
  )
}
