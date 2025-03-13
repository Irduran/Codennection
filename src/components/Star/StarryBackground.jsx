import React, { useEffect } from 'react';
import './StarryBackground.css';

const StarryBackground = () => {
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1; 
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animationDuration = `${Math.random() * 2 + 1}s`; 
      document.querySelector('.starry-background').appendChild(star);
    };

    const createStars = () => {
      for (let i = 0; i < 200; i++) {
        createStar();
      }
    };

    createStars();
  }, []);

  return <div className="starry-background"></div>;
};

export default StarryBackground;