import React, { useState } from "react";
import axios from "axios";

const UploadImageForm = () => {
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");


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
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    try {
      console.log(data);
      const response = await axios.post('http://localhost:5000/posts',data);
      console.log(response.data); // Newly created post data from the server
      // Optionally, you can update the state to clear the form after a successful upload.
      setImage(null);
      setSlug("");
      setTags("");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Image Url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadImageForm;
