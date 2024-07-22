import React, { useState } from 'react';

const HomePage = () => {
  const [sprinkles, setSprinkles] = useState([]);

  const handleClick = (e) => {
    const sprinkleCount = 4;
    const newSprinkles = [];

    for (let i = 0; i < sprinkleCount; i++) {
      newSprinkles.push({
        id: Date.now() + i,
        x: e.clientX + (Math.random() * 20 - 10),
        y: e.clientY + (Math.random() * 20 - 10) - 20, // Adjust position to appear at the peak of the cursor
      });
    }

    setSprinkles((prevSprinkles) => [...prevSprinkles, ...newSprinkles]);

    setTimeout(() => {
      setSprinkles((prevSprinkles) =>
        prevSprinkles.filter((sprinkle) => !newSprinkles.some(ns => ns.id === sprinkle.id))
      );
    }, 1000); // sprinkle duration
  };

  const keyframes = `
    @keyframes sprinkleAnimation {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      100% {
        opacity: 0;
        transform: scale(0) translateY(-20px);
      }
    }
  `;

  return (
    <div
      onClick={handleClick}
      style={{ textAlign: 'center', padding: '20px', position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      <style>
        {keyframes}
      </style>
      {sprinkles.map((sprinkle) => (
        <div
          key={sprinkle.id}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: '#ff69b4', // pink color
            borderRadius: '50%',
            pointerEvents: 'none',
            left: `${sprinkle.x}px`,
            top: `${sprinkle.y}px`,
            animation: 'sprinkleAnimation 1s forwards',
          }}
        ></div>
      ))}
      <h1>Hello</h1>
    </div>
  );
};

export default HomePage;
