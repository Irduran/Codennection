import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Registro from './Registro/Registro';
import PostList from './PostList/PostList'
import Post from './Posts/Post';
import CreatePost from './CreatePost/CreatePost';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/new" element={<Dashboard />} />
        <Route path="/post" element={<Post  
            username="CarlosDev"
            time="hace 3 horas"
            text="¡Finalmente terminé de integrar la API! 🎉 Ahora mi aplicación está lista para manejar peticiones en tiempo real. #coding #react #api"
            media={[
              { type: "image", url: "https://code.visualstudio.com/assets/home/swimlane-anywhere.png" },
              { type: "image", url: "https://lvivity.com/wp-content/uploads/2018/10/web-based-apps.jpg" },
              { type: "image", url: "https://code.visualstudio.com/assets/home/swimlane-anywhere.png" },
              { type: "image", url: "https://lvivity.com/wp-content/uploads/2018/10/web-based-apps.jpg" }
            ]}
            quacks={55}
            comments={[
              { username: "AnaCode", text: "¡Genial! ¿Usaste Axios para las peticiones?", likes: 10 },
              { username: "LuisTech", text: "¡Felicitaciones! ¿Cómo gestionaste los errores de la API?", likes: 8 }
            ]}
          />} />


      </Routes>
    </Router>
  );
};

export default App;