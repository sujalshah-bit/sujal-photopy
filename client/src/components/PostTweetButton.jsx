import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../store/context";

const PostTweetButton = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const {setModel} = useUserContext()

  const handleButtonClick = () => {
    setModel(true)
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModel(false)
    setModalOpen(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !slug) {
      console.error("Please provide both an image and a slug.");
      return;
    }
    console.log(image.name);
    const data = {
      image: image,
      slug: slug,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      // console.log(data);
      const response = await axios.post("https://sujal-photopy-api.vercel.app/posts", data);
      console.log("statuscode", response.status); // Newly created post data from the server
      // Optionally, you can update the state to clear the form after a successful upload.
      setImage("");
      setSlug("");
      setTags("");
    } catch (error) {
      if (error.response.data.message === "Authentication token required") {
        setModalOpen(false);
        setImage("");
        setSlug("");
        setTags("");
        navigate("/login");
      }
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <button className="" onClick={handleButtonClick}>
        Upload
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* Background will be blurred when modal is open */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-50"
            onClick={handleCloseModal}
          ></div>

          <div className="bg-[#1E293B] text-white rounded p-4  sm:w-1/2 z-50 relative">
            {/* Your tweet form content goes here */}
            <h2 className="text-xl font-bold mb-4">Upload Image</h2>
            {/* Add your tweet form fields here */}
            <input
              type="text"
              placeholder="Image Url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className=" bg-[#1E293B] outline-none w-full px-4 py-2 rounded border  border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className=" bg-[#1E293B] outline-none w-full px-4 py-2 rounded border border-gray-300 mb-2  focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className=" bg-[#1E293B] outline-none w-full px-4 py-2 rounded border border-gray-300 mb-4  focus:ring-2 focus:ring-blue-300"
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded w-full transition-all duration-300 ease-in-out"
              onClick={handleUpload}
            >
              Upload
            </button>
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={handleCloseModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTweetButton;
