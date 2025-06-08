import react from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Signup from "./pages/signup"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
