import React, { useEffect, useState } from 'react';
import styles from './Error403.module.css'; // Import CSS module
import { Link } from 'react-router-dom';
import unauthorizedImage from './hera-pheri-tu-ja-re.gif';

const Error403 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (evt) => {
      const x = evt.clientX / window.innerWidth;
      const y = evt.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const eyeStyle = {
    cx: `calc(115px + 30px * ${mousePosition.x})`,
    cy: `calc(50px + 30px * ${mousePosition.y})`,
  };

  return (
    <div className={styles.container} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
    <div className={styles.box}>
        <svg xmlns="http://www.w3.org/2000/svg" id="robot-error" viewBox="0 0 260 118.9" role="img" className={styles.svg}>
          <title xmlLang="en">403 Error</title>
          <defs>
            <clipPath id="white-clip">
              <circle id="white-eye" fill="#cacaca" cx="130" cy="65" r="20" />
            </clipPath>
            <text id="text-s" className={styles.errorText} y="106">
              403
            </text>
          </defs>
          <path className={styles.alarm} fill="#e62326" d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6" />
          <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black"></use>
          <use xlinkHref="#text-s" fill="#2b2b2b"></use>
          <g id="robot">
            <g id="eye-wrap">
              <use xlinkHref="#white-eye"></use>
              <circle id="eyef" className={styles.eye} clipPath="url(#white-clip)" fill="#000" stroke="#2aa7cc" strokeWidth="2" strokeMiterlimit="10" style={eyeStyle} r="11" />
              <ellipse id="white-eye" fill="#2b2b2b" cx="130" cy="40" rx="18" ry="12" />
            </g>
            <circle className={styles.lightblue} cx="105" cy="32" r="2.5" id="tornillo" />
            <use xlinkHref="#tornillo" x="50"></use>
            <use xlinkHref="#tornillo" x="50" y="60"></use>
            <use xlinkHref="#tornillo" y="60"></use>
          </g>
        </svg>
        <h1 className={styles.errorText}>You are not allowed to enter here</h1>
        <h2>
          Go <a  href="/" className={styles.link}>Home!</a>
          </h2>
    </div>

    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Unauthorized Access</h2>
      <p>You are not authorized to view this page.</p>
      <img src={unauthorizedImage} alt="Unauthorized" style={{ maxWidth: '100%', height: 'auto' }} />
      <p>Please <Link to="/">click here</Link> to return to the login page.</p>
    </div>
  </div>
  );
};

export default Error403;
