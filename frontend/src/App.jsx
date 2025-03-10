import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import EditPost from './pages/EditPost/EditPost.jsx';
import PostDetail from './pages/PostDetails/PostDetail.jsx';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
