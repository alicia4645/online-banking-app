// PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/loggedin/status/', {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response)
      setAuth(true);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      setAuth(false);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return auth ? children: <Navigate to="/signin" />;
};

export default PrivateRoute;
