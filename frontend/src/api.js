// src/api.js
// const API_URL = "http://localhost:5000"; 
// const API_URL = "https://devoir-9q8e.onrender.com"; 
// export default API_URL;



// src/api.js

const hostname = window.location.hostname;

const API_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? "http://localhost:5000" 
  : "https://devoir-9q8e.onrender.com"; // <--- NO SLASH at the end!

export default API_URL;