import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

const createStarryBackground = () => {
  const createStar = () => {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${Math.random() * 2 + 1}s`;
    document.body.appendChild(star);
  };

  for (let i = 0; i < 200; i++) {
    createStar();
  }
};

const pastelColors = ['#fbb1ff', '#e6a8ff', '#ffc1f3', '#ddaaff', '#f8d1ff', '#f7aef8'];

const createMagicDust = (x, y) => {
  const dust = document.createElement('div');
  dust.className = 'magic-dust';
  dust.style.left = `${x}px`;
  dust.style.top = `${y}px`;
  dust.style.background = `radial-gradient(circle, ${getRandomColor()}, transparent)`;
  document.body.appendChild(dust);

  setTimeout(() => {
    dust.remove();
  }, 1000);
};

const getRandomColor = () => {
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};

window.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.7) {
    createMagicDust(e.clientX, e.clientY);
  }
});


createStarryBackground();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);