import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Registro from './Registro/Registro';
import PostList from './PostList/PostList'
import Post from './Posts/Post';
import CreatePost from './CreatePost/CreatePost';
import { RouterApp } from './RouterApp';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/new" element={<Dashboard />} />
      </Routes>
    </Router>
      <BrowserRouter>
        <RouterApp/>
        </BrowserRouter>
  );
};

export default App;