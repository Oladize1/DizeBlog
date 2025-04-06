import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../Component/Spinner'
import { useAuthStore, usePostStore } from '../store'


const loginPage = () => {
  const [username, setUsername] = useState('')  
  const [password, setPassword] = useState('')
 

  const {user, login, isLoading, error} = useAuthStore()
  
  

  const navigate = useNavigate()
  
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])
  
  if (isLoading) {
    return <Spinner />
  }

 const canSave = Boolean(username) && Boolean(password) 




 const handleLogin = async e => {
  e.preventDefault()
  try {
    await login(username, password)
    toast.success('log in successful')
    navigate('/')
  } catch (error) {
    toast.error(error.response?.data || 'Invalid credentials')   
  }
 }

 

  return (
    <div>
      <form className='rounded-md ring-1 p-4 mx-auto w-96 m-5' onSubmit={handleLogin}>
        <h2 className='text-center text-bold text-3xl py-2.5'>Login</h2>
      <div>
      <label className="input validator">
          <svg
           className="h-[1em] opacity-50" 
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round"  strokeWidth="2.5" fill="none" stroke="currentColor">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2">
                </path><circle cx="12" cy="7" r="4">
                  </ circle></g>
          </svg>
          <input 
          type="text" 
          required placeholder="Username" 
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minLength="3" 
          maxLength="30" 
          title="Only letters or numbers"
          value={username}
          onChange={(e) => setUsername(e.target.value)}   
          />
      </label>
    <p className="validator-hint">
     Must be 3 to 30 characters
      <br/>containing only letters or numbers
      </p>
      </div>
      <div>
        <label className="input validator">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
  <input
   type="password"
   required
   placeholder="Password" 
   minLength="8" 
   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
   title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
   value={password}
   onChange={(e) => setPassword(e.target.value)} 
   />
        </label>
        <p className="validator-hint hidden">
  Must be more than 8 characters, including
  <br/>At least one number
  <br/>At least one lowercase letter
  <br/>At least one uppercase letter
        </p>
      </div>
      <button disabled={!canSave} className="flex btn bg-blue-500 text-amber-100  btn-wide items-center mt-2 mx-auto">Login</button>
      <p className="text-center mt-2">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  )
}

export default loginPage