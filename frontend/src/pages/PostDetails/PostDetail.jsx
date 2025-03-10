import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';
import { BASE_URL } from '../../config';


const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Store logged-in user info

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/posts/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    };

    fetchPost();
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a post');
      return;
    }

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${BASE_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Post deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p className="author">By {post.author.username} | {new Date(post.createdAt).toLocaleDateString()}</p>
      <p className="content">{post.content}</p>

      {user && user._id === post.author._id && (
        <div className="actions">
          <Link to={`/edit/${post._id}`} className="edit-button">Edit</Link>
          <button onClick={handleDelete} className="delete-button">Delete</button>
        </div>
      )}

      <Link to="/" className="back-button">Go Back</Link>
    </div>
  );
};

export default PostDetail;
