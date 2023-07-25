import React, { useState, useEffect } from "react";
import axios from "axios";
// import ReactPaginate from "react-paginate";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(() => {
    // Get the initial value from localStorage if it exists
    const storedMessage = localStorage.getItem("message");
    return storedMessage || "Post Unlike Successfully";
  });

  useEffect(() => {
    // Fetch all posts
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Function to handle liking a post
  const handleLike = async (postId) => {
    try {
      // Send a POST request to like/unlike the post
      const response = await axios.post(
        `http://localhost:5000/posts/${postId}/like`
      );
      setMessage(response.data.message);
      // Store the message in localStorage
      localStorage.setItem("message", response.data.message);
      // Refresh the posts after successfully liking/unliking the post
      axios.get("http://localhost:5000/posts").then((response) => {
        setPosts(response.data);
      });
    } catch (error) {
      if (error.response.data.message === "Authentication token required") {
       
        navigate("/login");
      }
      console.error("Error liking/unliking the post:", error);
    }
  };



  return (
    <div>
      {isLoading ? (
        <div className="h-screen grid place-items-center">
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 space-y-4 space-x-4">
          {posts.map((post) => (
            <div key={post._id} className="relative aspect-w-1 aspect-h-1">
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.slug}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2">
                <button
                  className={`${
                    message === "Post liked successfully"
                      ? "bg-pink-500 text-white"
                      : "bg-red-500 text-white"
                  } rounded-full w-8 h-8 flex items-center justify-center`}
                  onClick={() => handleLike(post._id)}
                >
                  {message === "Post liked successfully" ? (
                    <AiFillHeart />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </button>
              </div>
              <div className="p-3 bg-[#1E293B] flex items-center rounded-lg mt-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                  Likes: {post.likes.length}
                </button>
                <Link
                  to={`/${post._id}#comments`}
                  className="bg-indigo-600 text-white flex items-center gap-2 px-3 py-1 rounded ml-2 cursor-pointer"
                >
                  <FaRegComment /> <p>({post.comments.length})</p>
                </Link>
                <Link
                  to={`/${post._id}`}
                  className="bg-indigo-700 text-white flex items-center gap-2 px-3 py-1 rounded ml-2 cursor-pointer"
                >
                  See Posts
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default HomePage;

