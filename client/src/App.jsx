import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Footer from "./Component/Footer";
import Homepage from "./Pages/HomePage";
import Navbar from "./Component/Navbar";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/Dashboard";
import ProtectedPage from "./Component/ProtectedPage";
import PostPage from './Pages/PostPage'
import ErrorPage from "./Pages/ErrorPage";
import CreatePostPage from "./Pages/CreatePostPage";
import EditPostPage from './Pages/EditPostPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store";


const App = () => {
  const { user } = useAuthStore()
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ToastContainer />
      <Outlet/>
      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route index={true} path="/" element={<Homepage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="" element={<ProtectedPage/>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/post/:id" element={<PostPage/>} />
            <Route path="/createPost" element={<CreatePostPage/>} />
            <Route path={`/editPost/${user?.username}/:id`} element={<EditPostPage/>} />
            <Route path="/*" element={<ErrorPage/>} />
          </Route>
        </Routes>
      </div>

      {/* Footer Stays at the Bottom */}
      <Footer />
    </div>
  );
};

export default App;
