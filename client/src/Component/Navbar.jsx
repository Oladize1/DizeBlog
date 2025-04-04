import React from 'react'
import { Link } from 'react-router-dom'
import { IoCreate } from "react-icons/io5"; 
import { useAuthStore } from '../store';


const Navbar = () => {
  const { user, logout } = useAuthStore()
  
  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link className="btn btn-ghost text-xl" to={'/'}>Dize</Link>
  </div>
  { user ?  <div className="flex items-center gap-2">
    {user.role === 'author' ? <button className="btn bg-black text-white border-black">
      <IoCreate className="text-2xl"/>
      <Link to={'/createPost'} >Create Post</Link>
</button>: ''}  
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li> 
          <Link className="justify-between" to={'/dashboard'}>Dashboard</Link>
        </li>
        <li><button onClick={() => {logout()}}>logout</button></li>
      </ul>
    </div>
  </div>: <button className="btn btn-active btn-info text-white"><Link to={'/login'}>login</Link></button>}
 
</div>
  )
}

export default Navbar