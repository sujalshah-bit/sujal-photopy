import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdatePost from './UpdatePost';
import DeletePost from './DeletePost';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';


const MyPostsPage = ({ handleLogout }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false); // State variable to toggle update section
  const [updatePostId, setUpdatePostId] = useState(null); // State variable to store the post ID being updated

  useEffect(() => {
    // Fetch the user's uploaded photos
    axios.get('http://localhost:5000/posts/my-posts', {
      withCredentials: true, // Send the user's cookies for authentication
    })
      .then((response) => {
        setMyPosts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
      });
  }, []);

  // Function to toggle update section
  const handleToggleUpdate = (postId) => {
    setShowUpdate(!showUpdate);
    setUpdatePostId(postId);
  };

  return (
    <div className="text-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {myPosts.map((post) => (
            <div key={post._id} className="bg-[#1E293B] rounded-lg p-4 shadow-md">
              <img src={post.image} alt={post.slug} className="w-full h-64 rounded-lg object-cover mb-4" />
              <p className="text-xl font-bold mb-2">{post.slug}</p>
              <p className="text-gray-600 mb-2">{post.tags.join(', ')}</p>
              <div className="flex items-center mb-2">
                <button
                  className={`mr-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                >
                  {post.isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <button
                  className="text-indigo-500 hover:underline cursor-pointer"
                  onClick={() => handleToggleUpdate(post._id)}
                >
                  Update
                </button>
              </div>
              {/* {post.comments.map((comment, index) => (
                <div key={index} className="mb-2">
                  <strong className="mr-1">{comment.user.username}</strong>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              ))} */}
              {/* Display the UpdatePost component only if showUpdate is true and postId matches */}
              {showUpdate && updatePostId === post._id && (
                // Display the UpdatePost form in a modal
                <div className="fixed inset-0 flex items-center justify-center">
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-50"
                    onClick={() => setShowUpdate(false)} // Close the modal when clicking outside
                  ></div>
                  <div className="bg-[#1E293B] text-white rounded p-4 w-[300px] sm:w-1/2 z-50 relative">
                    <UpdatePost postId={post._id} />
                  </div>
                </div>
              )}
              <DeletePost postId={post._id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPostsPage;
