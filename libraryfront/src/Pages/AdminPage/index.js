import { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { AuthContext } from '../../Contexts/authContext';
import Login from '../Login';
import MyComponent from './Components/test';
import { Link } from 'react-router-dom'
import Author from './Pages/Author/Author';
import Category from './Pages/Category/Category';
import {BsBook, BsPerson} from 'react-icons/bs'
import {BiCategory} from 'react-icons/bi'
import { TbReportSearch } from 'react-icons/tb'
import Book from './Pages/Book/Book';
import Report from './Pages/Report';

function AdminPage() {
    const { user, login, logout } = useContext(AuthContext);
    const [page, setPage] = useState('author')

    const pages = {
        'author': <Author />,
        'book': <Book />,
        'category': <Category />,
        'report': <Report />
    }

    return (
        <div className='bg-white'>
            <aside className='bg-gray-800 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0'>
                <div className='relative border-b border-white/20'>
                    <p className='flex text-white items-center gap-8 py-6 m-4 px-8 text-xl'>Library  Admin</p>
                </div>
                <div className='m-4 text-white'>
                    <ul className='my-10 ml-8 flex flex-col gap-7 text-lg'>
                        <li>
                            <Link onClick={() => setPage('author')} className='flex'>
                                <BsPerson className='mt-1 mr-4'/>
                                Authors
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => setPage('book')} className='flex'>
                                <BsBook className='mt-1 mr-4'/>
                                Books
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => setPage('category')} className='flex'>
                                <BiCategory className='mt-1 mr-4'/>
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => setPage('report')} className='flex'>
                                <TbReportSearch className='mt-1 mr-4' />
                                Reports
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            {pages[page]}
            
        </div>
      );
}

export default AdminPage;
