import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { TailSpin } from "react-loader-spinner";
// import InfinitySpin from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const HomePage = ({ handleLogout }) => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // const [loadingType, setLoadingType] = useState("TailSpin");
  const postsPerPage = 5; // Number of posts to display per page
  useEffect(() => {
    // Fetch all images uploaded by all users
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        if (response.data.length > 0) {
          setPosts(response.data);
        } else {
          console.log("No posts available");
        }
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false when the request is complete
      });
  }, []);

  // Function to handle liking a post
  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/like`);
      // Update the like status for the post in the frontend
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, isLiked: !post.isLiked } // Toggle the like status
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // Function to handle adding a comment
  const handleComment = async (postId, text) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/comment`, {
        text,
      });
      // Refresh the posts after successfully adding the comment
      axios.get("http://localhost:5000/posts").then((response) => {
        setPosts(response.data);
      });
    } catch (error) {
      console.error("Error adding a comment:", error);
    }
  };

  // Calculate the index of the last post of the current page
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  // Calculate the index of the first post of the current page
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // Get the posts to be displayed on the current page
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Function to handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      {isLoading ? (
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <div>
          <h1>Home Page</h1>
          <button onClick={handleLogout}>Logout</button>

          <Link to={"/upload"}>upload</Link>
          <Link to={"/mypost"}> My posts</Link>
          <Link to={"/register"}> register</Link>
          <Link to={"/login"}> login</Link>
          {currentPosts.map((post) => (
            <div key={post._id}>
              <img src={post.image} alt={post.slug} />
              <p>{post.slug}</p>
              <p>{post.tags.join(", ")}</p>
              <p>{post.likes.length}</p>
              <button onClick={() => handleLike(post._id)}>Like</button>
              <div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button onClick={() => handleComment(post._id, commentText)}>
                  Comment
                </button>
                {/* {display comments} */}
                {post?.comments.map((comment) => {
                  return (
                    <div>
                      <strong>{comment?.user?.username}</strong>
                      <p>{comment?.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Pagination component */}
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            pageCount={Math.ceil(posts.length / postsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
