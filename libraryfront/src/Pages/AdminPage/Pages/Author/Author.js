import React, {useEffect, useState } from 'react'
import AuthorTable from './Components/AuthorTable';
import Modal from '../../Components/Modal';
import axios from 'axios';
import AuthorUpdate from './Components/AuthorUpdate';
import AuthorCreate from './Components/AuthorCreate';

export default function Author() {
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [user, setUser] = useState(null)
    const [authors, setAuthors] = useState([])

    useEffect(() => {
        getAuthors()
    }, [])
    const getAuthors = async() => {
        const response = await axios.get('http://localhost:5142/api/User');
        setAuthors(response.data.filter(a => a.role === "Author"))
        console.log(response.data)
    }

    const handleSubmit = (e) => {
          setAuthors([...authors, e])
          setCreateModal(false)
      };

      const handleDelete = async(id) => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.delete(`http://localhost:5142/api/User/${id}`, {headers : {
            Authorization: `Bearer ${token}`,
            RefreshToken: refreshToken
        }});
        console.log(response)
        
        setAuthors(authors.filter(a => a.id !== id))
    }

    const handleEdit = async(updatedUser) => {
        setEditModal(true)
        setUser(updatedUser)
    }

    const handleEditSubmit = async(updatedUser) => {
      setEditModal(false)
      setUser(null)
      setAuthors([...authors.filter(a => a.id != updatedUser.id), updatedUser])
  }

    const handleClose = () => {
      setCreateModal(false)
      setEditModal(false)
    }


    return (
        <div className='my-3 p-4 ml-80 mr-5 grid gap-7 relative flex flex-col rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 overflow-hidden xl:col-span-2'>
             <div className='relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6'>
                <p className='text-xl'>Author Management</p>
                <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setCreateModal(true)}
      >
        Create new author
      </button>
        </div>

      
      {createModal ? 
            <Modal  label={'Create Author'} close={handleClose}>
              <AuthorCreate handleCreate={handleSubmit}/>
            </Modal> 
            : null}
            {editModal ? <Modal label={'Edit Author'} close={handleClose}>
              <AuthorUpdate user={user} update={handleEditSubmit}/>
          </Modal>: null}
            <AuthorTable authors={authors} Delete={handleDelete} edit={handleEdit}/>
        </div>
    )
}
