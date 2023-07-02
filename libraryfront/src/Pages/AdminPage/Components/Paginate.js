import React from 'react';
 
const Paginate = ({ itemsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / itemsPerPage); i++) {
       pageNumbers.push(i);
       console.log(pageNumbers)
    }

  
    return (
       <div className="">
          <ul className="flex">
             {pageNumbers.map((number) => {
             console.log("here", number)
             return (
                <li
                   key={number}
                   onClick={() => paginate(number)}
                   className="px-4 py-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mx-1 rounded-[50%]"
                >
                   {number}
                </li>
             )})}
          </ul>
       </div>
    );
 };
 
export default Paginate;