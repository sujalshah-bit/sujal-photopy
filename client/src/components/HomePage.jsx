import React, { useState, useEffect } from "react";
import axios from "axios";
// import ReactPaginate from "react-paginate";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../store/context";

const HomePage = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likeStates, setLikeStates] = useState([]);
  const {model} = useUserContext()
  useEffect(() => {
    // Fetch all posts
    axios
      .get("https://sujal-photopy-api.vercel.app/posts")
      .then((response) => {
        setPosts(response.data);
        // Initialize the likeStates array with the initial like state for each post
        setLikeStates(response.data.map((post) => post.isLiked));
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Function to handle liking a post
  const handleLike = async (postId, index) => {
    try {
      // Send a POST request to like/unlike the post
      const response = await axios.post(
        `https://sujal-photopy-api.vercel.app/posts/${postId}/like`
      );
      
      // Update the like state for the specific post
      setLikeStates((prevState) => {
        const newLikeStates = [...prevState];
        newLikeStates[index] = response.data.message === "Post liked successfully";
        return newLikeStates;
      });
      // Store the message in localStorage
      localStorage.setItem("message", response.data.message);
      // Refresh the posts after successfully liking/unliking the post
      axios.get("https://sujal-photopy-api.vercel.app/posts").then((response) => {
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
          {posts.map((post,index) => (
            <div key={post._id} className={`${model?"-z-10":""} relative aspect-w-1 aspect-h-1`}>
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
                    likeStates[index]
                      ? "bg-pink-500 text-white"
                      : "bg-red-500 text-white"
                  } rounded-full w-8 h-8 flex items-center justify-center`}
                  onClick={() => handleLike(post._id, index)}
                >
                  {likeStates[index] ? <AiFillHeart /> : <AiOutlineHeart />}
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

