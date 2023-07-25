import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeletePost = ({ postId }) => {

  const navigate = useNavigate()
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/posts/${postId}`);
      console.log(response); // Post deleted successfully
      navigate('/')
      // Perform any additional actions after successful deletion, if needed
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="mt-4">
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default DeletePost;
