import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './components/Login';
import Home from './container/Home';

const App = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
  // }, []);

  return (
    // <GoogleOAuthProvider>
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
    // </GoogleOAuthProvider>
  )
}

export default App
