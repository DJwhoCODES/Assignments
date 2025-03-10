import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { BASE_URL } from '../../config';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const token = localStorage.getItem("token"); // Get JWT token

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/posts`, {
          params: {
            page: currentPage, // Add page number
            limit: 6, // Number of posts per page
          },
        });
        setPosts(res.data.posts); // Assuming the backend returns an array of posts in the `posts` field
        setTotalPages(res.data.totalPages); // Assuming the backend returns the total number of pages
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [currentPage, posts]);

  // 🗑️ Handle Delete Post
  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${BASE_URL}/posts/${postId}`, {
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

  // Handle Like Post
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
  
      // Update the like count in the UI
      setPosts((prevPosts) => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error.response.data.message);
      alert(error.response.data.message);
    }
  };
  

  // Pagination Logic
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

              {/* Like Button */}
              <div>
                <button onClick={() => handleLike(post._id)}>
                  👍 {post.likes ? post.likes.length : 0} Likes
                </button>
              </div>

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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
