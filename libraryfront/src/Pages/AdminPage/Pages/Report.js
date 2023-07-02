import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Paginate from '../Components/Paginate';

export default function Report() {
    const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(5);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    getAuthors()
    }, [])

    const getAuthors = async() => {
        const response = await axios.get('http://localhost:5142/api/User');
        setAuthors(response.data.filter(a => a.role === "Author").sort((a, b) => b.books.length - a.books.length))
        console.log(response.data)
    }


  // Get current authors
  
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  
  const renderedAuthors = currentAuthors.map((a) => {
    console.log("here books", a.id)
      return (
          <tr key={a.id} className='py-3 px-5 border-b border-blue-gray-50'>
             <td>{a.name}</td>
             <td>{a.surname}</td>
             <td>{a.books.length}</td>
          </tr>
)
})
  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className='my-3 p-4 ml-80 mr-5 grid gap-7 relative flex flex-col rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 overflow-hidden xl:col-span-2'>
        <div className='relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6'>
                <p className='text-xl'>Reports Table</p>
                <div className='flex flex-col items-center'>
                    <table className='w-full min-w-[640px] table-auto m-8 mx-auto'>
                        <thead className='border-b border-blue-gray-50 py-3 px-6 text-left'>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Number of Books</th>
                        </thead>
                        <tbody className=''>
                            {renderedAuthors}
                            
                        </tbody>
                    </table>
                    {authors && 
                    <Paginate 
                        itemsPerPage={authorsPerPage}
                        totalPosts={authors.length}
                        paginate={paginate}
                    />
                    }
                </div>
        </div>
    </div>
  )
}

