import React, { useState } from 'react';
import axios from 'axios';

const UpdatePost = ({ postId }) => {
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const handleUpdate = async () => {
    try {
      // Optimistic update - update the state immediately
      // to make the UI appear responsive
      const updatedPost = {
        _id: postId,
        slug: slug || null, // If slug is not provided, pass null
        tags: tags ? tags.split(',').map((tag) => tag.trim()) : null, // If tags are not provided, pass null
      };

      // Update the state with the optimistic update
      setSlug(slug);
      setTags(tags);

      const response = await axios.put(`https://sujal-photopy-api.vercel.app/posts/${postId}`, updatedPost);
      console.log(response.data); // Updated post data

      // Update the state with the response from the server
      setSlug(response.data.slug);
      setTags(response.data.tags.join(', '));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  return (
    <div>
      <h2 className='text-2xl text-center p-3  tracking-wider'><strong>Update Post</strong></h2>
      <div className='flex flex-col  gap-3'>
        <input className='p-1 outline-none border bg-[#1E293B] border-gray-400' type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <input className='p-1 outline-none border bg-[#1E293B] border-gray-400' type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className='p-1 outline-none border bg-[#1E293B] border-gray-400' type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button className='bg-rose-600 p-3 md:self-start md:rounded' onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default UpdatePost;
