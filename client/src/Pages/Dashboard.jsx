import React, { useEffect } from 'react';
import Spinner from '../Component/Spinner';
import { IoCreate } from 'react-icons/io5';
import { AiFillDelete } from "react-icons/ai";
import { useAuthStore } from '../store';
import { usePostStore } from '../store'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { error, isLoading, authorPosts, getAuthorPosts, getAllPosts, getSinglePost, deletePost, bookmarks, posts } = usePostStore();
  const navigate = useNavigate();

  if (!user) {
    return <div>Please log in to view the dashboard.</div>;
  }
  const name = user?.name || '';
  const username = user?.username || '';
  const role = user?.role || 'user';

  // Fetch author posts if user is author and fetch all posts so we can filter bookmarks.
  useEffect(() => {
    if (user && role === 'author') getAuthorPosts();
    getAllPosts();
  }, [user, role, getAuthorPosts]);

  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Sync bookmarks state to localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    userInfo.bookmarks = bookmarks;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [bookmarks, deletePost]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading data.</div>;

  

  // Filter posts to get those that are bookmarked
  const myBookmarks = posts.filter(post => bookmarks.includes(post._id.toString()));
  
  

  const handleSinglePost = (id) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      getSinglePost(id);
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error(error);
      if (error.response?.data?.message.includes('jwt expired')) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleEditPost = async (id) => {
    try {
      if (!user) {
        navigate('/login');
      }
      await getSinglePost(id);
      navigate(`/editPost/${username}/${id}`);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      if (!window.confirm('Delete this post permanently?')) return;
      await deletePost(id);
      await getAuthorPosts()
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* User Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="mt-4">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Username:</span> {username}
            </p>
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bookmarks</h2>
          {myBookmarks.length > 0 ? (
            <ul className="space-y-2">
              {myBookmarks.map((bookmark) => (
                <li key={bookmark._id} className="text-gray-700 hover:text-blue-600 cursor-pointer">
                  <p onClick={() => handleSinglePost(bookmark._id)}>{bookmark.title} <span></span></p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bookmarks yet.</p>
          )}
        </div>

        {/* Posts Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {role === 'author' ? (
            authorPosts.length > 0 ? (
              <ul className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Posts</h2>
                {authorPosts.map((post) => (
                  <li key={post._id} className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-gray-600 mt-1">{post.description}</p>
                    <div className="mt-2 space-x-2 flex gap-3">
                      <button
                        type="button"
                        className="flex items-center cursor-pointer bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post._id);
                        }}
                      >
                        <IoCreate className="mr-1 cursor-pointer" /> Edit
                      </button>
                      <button
                        className="flex items-center cursor-pointer bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <AiFillDelete /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No posts yet.</p>
            )
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
