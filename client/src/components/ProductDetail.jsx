import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {  FiMessageCircle, FiSend } from "react-icons/fi";
import { getTimeDifferenceString } from "../utility/timeDifference";
import { TailSpin } from "react-loader-spinner";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useMediaQuery } from '@react-hook/media-query';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [toggleComment, setToggleComment] = useState("");
  // const [message, setMessage] = useState(() => {
  //   // Get the initial value from localStorage if it exists
  //   const storedMessage = localStorage.getItem("message");
  //   return storedMessage || "Post Unlike Successfully";
  // });

  

  useEffect(() => {
    // Fetch the post details using the postId
    axios
      .get(`https://sujal-photopy-api.vercel.app/posts/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        if (error.response.data.message === "Authentication token required") {
        navigate("/login");
      }
        console.error("Error fetching post details:", error);
      });
  }, [id]);
  
  // const handleLike = async (postId) => {
  //   try {
  //     // Send a POST request to like/unlike the post
  //     const response = await axios.post(
  //       `https://sujal-photopy-api.vercel.app/posts/${postId}/like`
  //     );
  //     setMessage(response.data.message);
  //     // Store the message in localStorage
  //     localStorage.setItem("message", response.data.message);
  //     // Refresh the posts after successfully liking/unliking the post
  //     axios.get(`https://sujal-photopy-api.vercel.app/posts/${id}`).then((response) => {
  //       setPost(response.data);
  //     });
  //   } catch (error) {
  //     console.error("Error liking/unliking the post:", error);
  //   }
  // };
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://sujal-photopy-api.vercel.app/posts/${id}/comment`, {
        text: newComment,
      });
      // Refresh the post details after adding the comment
      axios.get(`https://sujal-photopy-api.vercel.app/posts/${id}`).then((response) => {
        setPost(response.data);
        setNewComment("");
      });
    } catch (error) {
      console.error("Error adding a comment:", error);
    }
  };
  const isAboveMd = useMediaQuery('(min-width: 768px)');


  if (!post) {
    return (
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
    );
  }

    const CodeA = (
      <div className="max-w-screen-xl mx-auto h-[85vh] mt-8 md:flex md:max-w-screen-lg rounded-md shadow-md text-white bg-[#1E293B]">
      {/* Box 1: Image */}
      <div className="md:w-1/2 h-[85vh] ">
        <img
          src={post.image}
          alt={post.slug}
          className="w-full   h-[85vh] rounded-md"
        />
      </div>

      {/* Box 2: User info and post info */}
      <div className="md:w-1/2 p-4 flex flex-col  gap-9">
          <div className="flex  flex-col">
            <span className="font-semibold text-2xl">{post?.slug}</span>
            </div>
        <div className="flex items-center  justify-between mt-4 bg-[#1E293B]">
          <div className="flex  flex-col">
            <span className="font-semibold text-xl">{post.createdBy?.username}</span>
          <div >
          <span className="font-semibold text-gray-500">
            {getTimeDifferenceString(post.createdAt)}
          </span>
        </div>
          </div>
          {/* Rest of the code for comments and like button */}
          <div className="flex gap-3 items-center">
            <FiMessageCircle
              size={30}
              className="mr-2 cursor-pointer"
              onClick={() => setToggleComment(!toggleComment)}
            />

            {/* <button
              className={`${
                message === "Post liked successfully"
                  ? "text-red-500 "
                  : " bg-transparent"
              } rounded-full w-8 h-8 flex items-center justify-center font-bold  transition-all`}
              onClick={() => handleLike(post._id)}
            >
              {message === "Post liked successfully" ? (
                <AiFillHeart size={30} />
              ) : (
                <AiOutlineHeart size={30} />
              )}
            </button> */}
        <span className="font-semibold text-[20px]">{post?.likes?.length} likes</span>
          </div>
        </div>
        
        {/* Rest of the code for comments display */}

        {toggleComment ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 z-50 flex justify-center items-center">
            <div className=" w-full h-screen rounded-lg p-4 flex flex-col">
              <div className="overflow-y-scroll h-[95vh] mt-8 ">
                {post?.comments?.map((comment) => (
                  <div key={comment.id} className="mb-4 py-2 pl-1 border">
                    <strong className="font-semibold">
                      {comment?.user?.username}:
                    </strong>
                    <span className="ml-2">{comment.text}</span>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleAddComment}
                className=" mt-4 flex  gap-5 flex-row sm:justify-between xl:w-[1280px] xl:m-auto border"
              >
                <input
                  type="text"
                  id="comments"
                  placeholder="Comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-shrink-0 w-3/4 xl:w-[1100px] p-2  bg-transparent rounded-md focus:outline-none  mr-2"
                />
                <button type="submit" className="text-rose-500 font-semibold md:mr-4">
                  <FiSend size={25} />
                </button>
              </form>

              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 cursor-pointer"
                onClick={() => setToggleComment(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 10l4.146-4.147a1 1 0 011.415 1.414L11.414 11l4.44 4.447a1 1 0 01-1.415 1.414L10 12.414l-4.147 4.44a1 1 0 01-1.414-1.415L8.586 11 4.146 6.553A1 1 0 115.56 5.138L10 9.586 14.44 5.146a1 1 0 111.414 1.415L11.414 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        <div onClick={() => setToggleComment(true)} className="mt-2 overflow-y-scroll h-64 pl-2  bg-gray-900 ">
          {post?.comments?.map((comment) => (
            <div key={comment.id} className="mb-2 py-2 px-3">
              <span className="font-semibold">{comment?.user?.username}:</span>
              <span className="ml-1">{comment.text}</span>
            </div>
          ))}
        </div>
        
      </div>
    </div>
    );

    const CodeB = (
      <div className="max-w-sm mx-auto   rounded-md shadow-md text-white bg-[#1E293B]">
      <img
        src={post.image}
        alt={post.slug}
        className="w-full h-80 object-cover rounded-md"
      />
      <div></div>
      <div className="p-4">
          <div className="flex items-center">
            <span className=" font-semibold text-xl">{post.slug}</span>
          </div>
        <div className="flex items-center justify-between mt-4 bg-[#1E293B]">
          <div className="flex items-center">
            <span className=" font-semibold text-lg">{post.createdBy?.username}</span>
          </div>
          <div className="flex gap-3 items-center">
            <FiMessageCircle
              size={30}
              className="mr-2 cursor-pointer"
              onClick={() => setToggleComment(!toggleComment)}
            />

            {/* <button
              className={`${
                message === "Post liked successfully"
                  ? "text-red-500 "
                  : " bg-transparent"
              } rounded-full w-8 h-8 flex items-center justify-center font-bold  transition-all`}
              onClick={() => handleLike(post._id)}
            >
              {message === "Post liked successfully" ? (
                <AiFillHeart size={30} />
              ) : (
                <AiOutlineHeart size={30} />
              )}
            </button> */}
          </div>
        </div>
        <div className="mt-2 ">
          <span className="font-semibold text-gray-500">
            {getTimeDifferenceString(post.createdAt)}
          </span>
        </div>
        <div className="mt-2"></div>
        <span className="font-semibold text-[20px]">{post?.likes?.length} likes</span>
        {toggleComment ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 z-50 flex justify-center items-center">
            <div className=" w-full h-screen rounded-lg p-4 flex flex-col">
              <div className="overflow-y-scroll h-[95vh] mt-8 ">
                {post?.comments?.map((comment) => (
                  <div key={comment.id} className="mb-4 py-2 pl-1 border">
                    <strong className="font-semibold">
                      {comment?.user?.username}:
                    </strong>
                    <span className="ml-2">{comment.text}</span>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleAddComment}
                className=" mt-4 flex  gap-5 flex-row sm:justify-between xl:w-[1280px] xl:m-auto border"
              >
                <input
                  type="text"
                  id="comments"
                  placeholder="Comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-shrink-0 w-3/4 xl:w-[1100px] p-2  bg-transparent rounded-md focus:outline-none  mr-2"
                />
                <button type="submit" className="text-rose-500 font-semibold md:mr-4">
                  <FiSend size={25} />
                </button>
              </form>

              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 cursor-pointer"
                onClick={() => setToggleComment(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 10l4.146-4.147a1 1 0 011.415 1.414L11.414 11l4.44 4.447a1 1 0 01-1.415 1.414L10 12.414l-4.147 4.44a1 1 0 01-1.414-1.415L8.586 11 4.146 6.553A1 1 0 115.56 5.138L10 9.586 14.44 5.146a1 1 0 111.414 1.415L11.414 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        <div onClick={() => setToggleComment(true)} className="mt-2 overflow-y-scroll h-28 pl-2  bg-gray-900 ">
          {post?.comments?.map((comment) => (
            <div key={comment.id} className="mb-2 py-2 px-3">
              <span className="font-semibold">{comment?.user?.username}:</span>
              <span className="ml-1">{comment.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
    return isAboveMd ? CodeA : CodeB;
    
}
export default PostDetail;
