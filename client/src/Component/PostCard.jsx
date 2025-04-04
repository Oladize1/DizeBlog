import React, {useEffect} from "react";
import DOMPurify from 'dompurify'
import { IoCreate } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { useAuthStore, usePostStore } from "../store";
import { format } from "timeago.js";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, onClick }) => {
  const { title, content, description, creator
, createdAt, likes, _id, watched } = post;

  const safeContent = DOMPurify.sanitize(content)
  const plainText = new DOMParser().parseFromString(safeContent, 'text/html').body.textContent || "";
  const { getSinglePost, likePost, bookmarks, addBookmark, posts} = usePostStore()
  const { user } = useAuthStore()
  
  const myBookmarks = user && user.bookmarks &&  bookmarks.some(bookmark => bookmark === _id) 

 
  

  const navigate = useNavigate();
  
  const handleEditPost = async (id) => {
    try {
      if (!user) {
        navigate('/login')
        return 
      }
      await getSinglePost(id)
      navigate(`/editPost/${user.username}/${id}`)
    } catch (error) {
      toast.error("post data not found")
    }
  }

  const handleLikePost = async (id) => {
    try {
       if (!user) {
        navigate('/login')
        return 
      }
      await likePost(id)
    } catch (error) {
      toast.error(error.response?.data || 'Operation Failed')
    }
  }

  const handleAddBookmark = async (id) => {
    try {
       if (!user) {
        navigate('/login')
        return
      }
      await addBookmark(id)
    } catch (error) {
      toast.error(error.response?.data || 'Operation Failed')
    }
  }

  // Truncate text properly without cutting words
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, text.lastIndexOf(" ", maxLength)) + "...";
  };

  return (
    <div onClick={onClick} className="bg-white shadow-lg rounded-lg overflow-hidden border cursor-pointer border-gray-200 p-5 space-y-3">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 uppercase">{title}</h2>

      {/* Description */}
      <p className="text-gray-600">{truncateText(description, 80)}</p>

      <p className="text-gray-700">{truncateText(plainText, 100)}</p>
      {/* {truncateText(content, 100)} */}

      {/* Footer: Author & Edit Button */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
        <p>By: <span className="font-semibold">{ creator?.name || "Unknown"}</span></p>
        {user?.role === "author" && user.id === creator?._id && (
          <button className="flex items-center cursor-pointer bg-black text-white px-3 py-1 rounded hover:bg-gray-800" onClick={(e) => {
            e.stopPropagation()
            handleEditPost(_id)
            }}>
            <IoCreate className="mr-1 cursor-pointer" /> Edit
          </button>
        )}
      </div>

      {/* 📊 Watched & Likes Section */}
      <div className="flex justify-between items-center text-gray-600 mt-3">
        {/* Views and Likes */}
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <FaEye className="text-blue-500 text-2xl" />
            <span>{watched?.length || 0}</span>
          </div>
        <div className="flex items-center gap-1 cursor-pointer" onClick={(e) => {
              e.stopPropagation()
              handleLikePost(_id)
              }} >
          {likes?.length === 0 ? <AiFillLike className="text-2xl" /> : <AiFillLike className="text-blue-500 text-2xl" /> }
          <span>{likes?.length || 0}</span>
        </div>
        </div>

        {/* Bookmark Button */}
        {user && !myBookmarks ? ( <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation()
            handleAddBookmark(_id)
          }}
          >
          <MdOutlineBookmarkAdd className="w-6 h-6" />
          Bookmark
        </button> ) : ''}
        
      </div>
      <p className="text-xs text-gray-400">Posted {format(createdAt)} </p>
    </div>
  );
};

export default PostCard;
