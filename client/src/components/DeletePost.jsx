import React from 'react';
import axios from 'axios';

const DeletePost = ({ postId }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/posts/${postId}`);
      console.log(response.data.message); // Post deleted successfully

      // Perform any additional actions after successful deletion, if needed
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h2>Delete Post</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeletePost;
