import { useState, useEffect } from "react";
import './TypingText.css'

export const TypingText = ({ text1, text2, delay, infinite }) => {
  const [currentText1, setCurrentText1] = useState("");
  const [currentText2, setCurrentText2] = useState("");
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex1 < text1.length) {
      timeout = setTimeout(() => {
        setCurrentText1((prevText) => prevText + text1[currentIndex1]);
        setCurrentIndex1((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (currentIndex2 < text2.length) {
      timeout = setTimeout(() => {
        setCurrentText2((prevText) => prevText + text2[currentIndex2]);
        setCurrentIndex2((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      setTimeout(() => {
        setCurrentIndex1(0);
        setCurrentText1("");
        setCurrentIndex2(0);
        setCurrentText2("");
      }, 1000); 
    }

    return () => clearTimeout(timeout);
  }, [currentIndex1, currentIndex2, delay, infinite, text1, text2]);

  return (
    <div className="typing-text">
      <span>{currentText1}</span>
      <br />
      <span className="text2">{currentText2}</span>
    </div>
  );
};
