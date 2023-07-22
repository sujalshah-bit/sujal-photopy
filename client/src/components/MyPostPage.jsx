import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdatePost from './UpdatePost';
import DeletePost from './DeletePost';

const MyPostsPage = ({ handleLogout }) => {
  const [myPosts, setMyPosts] = useState([]);

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

  return (
    <div>
      <h1>My Uploaded Photos</h1>
      <button onClick={handleLogout}>Logout</button>
      {myPosts.map((post) => (
        <div key={post._id}>
          <img src={post.image} alt={post.slug} />
          <p>{post.slug}</p>
          <p>{post.tags.join(', ')}</p>
          <p>{post.likes.length}</p>
          {
              post?.comments.map((comment) => {
                return(
                  <div>
                    <strong>{comment?.user?.username}</strong>
                    <p>{comment?.text}</p>
                  </div>
                )
              })
            }
          <UpdatePost postId={post._id}/>
          <DeletePost postId={post._id} />
        </div>
      ))}
    </div>
  );
};

export default MyPostsPage;
