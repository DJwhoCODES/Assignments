import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { title, content },
        { headers: { Authorization:  token } }
      );
      alert('Post created successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
