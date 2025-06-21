import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Signup from "./pages/signup"
import Signin from "./pages/signin"
import Home from "./pages/home"
import Transactions from "./pages/transactions"
import Transfers from "./pages/transfers"

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
        <Route path="transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
          } />
        <Route path="transfers" element={
          <PrivateRoute>
            <Transfers />
          </PrivateRoute>
        
        } />

      </Routes>
    </Router>
  );
}

export default App;
