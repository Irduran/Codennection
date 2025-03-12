import React, { useEffect, useState } from 'react';
import './TypingText.css';

const TypingText = () => {
  const [text, setText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "Connect with others";
  const typingSpeed = 150; // Velocidad de escritura en milisegundos

  useEffect(() => {
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText((prevText) => prevText + fullText[currentIndex]);
        currentIndex++;
      } else {
        
        setIsTypingComplete(true); // Marcar que el typing ha terminado
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [fullText, typingSpeed]);

  return (
    <div className={`typing-text-container ${isTypingComplete ? 'typing-complete' : ''}`}>
      <h1>{text}</h1>
    </div>
  );
};

export default TypingText;