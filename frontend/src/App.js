import react from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Signup from "./pages/signup"
import Signin from "./pages/signin"
import Home from "./pages/home"

function App() {
 

  return (
   <Router>
      <Routes>
        
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
            } />
         
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
