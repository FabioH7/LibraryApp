import React, { useState } from 'react'
import Modal from '../../../Components/Modal'
import BookEdit from './BookEdit'

export default function SingleBook({book, Delete, handleUpdate}) {
    const [editModal, setEditModal] = useState(false)

    let categories = ''
    for (let i = 0; i < book.categories.length; i++){
        if (i + 1 === book.categories.length){
            categories += book.categories[i]
        }
        else{
            categories += book.categories[i] + ', '
        }
    }
    console.log(book)

  return (
    <div className='my-3 p-4 relative rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 w-[200px]'>
        <img src={`http://localhost:5142/${book.imageUrl}`} height={350} width={250}></img>
        <div className='flex flex-col items-center space-y-1'>
            <p className='text-red-800'>{book.title}</p>
            <p className='text-gray-600'>{book.author}</p>
            <p className='text-gray-500'>{book.description}</p>
            <p>{categories}</p>
            <button onClick={() => {
                    setEditModal(true)
                    }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Edit</button>
            <button onClick={() => {
                    Delete(book.id)
                    }} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Delete</button>
            {editModal &&
            <Modal label={'Edit Book'} close={() => setEditModal(false)}>
                <BookEdit 
                book={book}
                handleUpdate={handleUpdate}
                />
            </Modal>
            }        
        </div>
    </div>
  )
}
