import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditPost.css';
import { BASE_URL } from '../../config';


const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit a post');
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/posts/${id}`,
        { title, content },
        { headers: { Authorization: token } }
      );
      alert('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Edit your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
