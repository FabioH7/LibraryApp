import React, { useState, useContext } from 'react'
import { AuthContext } from '../Contexts/authContext';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function Login() {
    const { user, login, logout } = useContext(AuthContext);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        await axios.post(
            "http://localhost:5142/Account/login",
            {
                userName: username,
                password: password
            }
          ).then(response => {
            console.log(response.data)
            login(response.data)
            window.location.search = ""
            window.location.pathname = "/admin"
        }).catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data,
              })
        });
    }

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>Welcome Back</h1>
                <form className='space-y-4 md:space-y-6' method='POST'>
                    <label for='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your Username</label>
                    <input onChange={handleUsernameChange} value={username} name='username'  placeholder='Username' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'></input>
                    <label  for='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your Password</label>
                    <input value={password} onChange={handlePasswordChange} type='password' name='password' placeholder='Password' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'></input>
                    <button onClick={handleLogin} className='w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}
