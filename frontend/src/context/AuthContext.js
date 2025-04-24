// import React, { createContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
//   );
//   const [user, setUser] = useState(() =>
//     localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null
//   );

//   const navigate = useNavigate();

//   const loginUser = async (email, password, role) => {
//     const response = await fetch('http://localhost:8000/api/token/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (response.status === 200) {
//       setAuthTokens(data);
//       setUser(jwtDecode(data.access));
//       localStorage.setItem('token', JSON.stringify(data));
//       localStorage.setItem('role', role);

//       if (role === 'rider') {
//         navigate('/rider-dashboard');
//       } else {
//         navigate('/driver-dashboard');
//       }
//     } else {
//       alert('Login failed');
//     }
//   };

//   const logoutUser = () => {
//     setAuthTokens(null);
//     setUser(null);
//     localStorage.clear();
//     navigate('/login');
//   };

//   const contextData = {
//     user,
//     authTokens,
//     loginUser,
//     logoutUser,
//   };

//   return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;



// import React, { createContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProviderWrapper = ({ children }) => {
//   const [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
//   );
//   const [user, setUser] = useState(() =>
//     localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null
//   );

//   const navigate = useNavigate();

//   const loginUser = async (email, password, role) => {
//     const response = await fetch('http://localhost:8000/api/token/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (response.status === 200) {
//       setAuthTokens(data);
//       setUser(jwtDecode(data.access));
//       localStorage.setItem('token', JSON.stringify(data));
//       localStorage.setItem('role', role);

//       if (role === 'rider') {
//         navigate('/rider-dashboard');
//       } else {
//         navigate('/driver-dashboard');
//       }
//     } else {
//       alert('Login failed');
//     }
//   };

//   const logoutUser = () => {
//     setAuthTokens(null);
//     setUser(null);
//     localStorage.clear();
//     navigate('/login');
//   };

//   const contextData = {
//     user,
//     authTokens,
//     loginUser,
//     logoutUser,
//   };

//   return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;


import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProviderWrapper = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null
  );

  const navigate = useNavigate();

  const loginUser = async (email, password, role) => {
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('token', JSON.stringify(data));
      localStorage.setItem('role', role);

      if (role === 'rider') {
        navigate('/rider-dashboard');
      } else {
        navigate('/driver-dashboard');
      }
    } else {
      alert('Login failed');
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.clear();
    navigate('/login');
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export { AuthProviderWrapper }; // use this in index.js
export default AuthContext;     // used in Login.js
