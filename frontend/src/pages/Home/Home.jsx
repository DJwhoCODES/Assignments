import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const token = localStorage.getItem("token"); // Get JWT token

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // 🗑️ Handle Delete Post
  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: token },
        });

        // Remove the deleted post from the UI
        setPosts(posts.filter((post) => post._id !== postId));

        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="home-container">
      <h2>All Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>By {post.author.username}</p>
              <p>
  Date:{" "}
  {new Date(post.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Change this to your correct timezone
  })}
</p>


              <Link to={`/post/${post._id}`} className="read-more">
                Read More
              </Link>

              {/* Show Edit & Delete Buttons if User is the Author */}
              {user && user === post.author.username && (
                <div className="post-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit/${post._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
