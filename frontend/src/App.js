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
import Cards from "./pages/cards"
import Accounts from "./pages/accounts"
import CurrentTranactions from "./pages/currentTranactions"
import SavingsTranactions from "./pages/savingsTranactions"
import 'bootstrap/dist/css/bootstrap.min.css'
import "./App.css"

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
        <Route path="cards" element={
          <PrivateRoute>
            <Cards />
          </PrivateRoute>
        } />
        <Route path="accounts" element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        } />
        <Route path="currentTranactions" element={
          <PrivateRoute>
            <CurrentTranactions />
          </PrivateRoute>
        } />
        <Route path="savingsTranactions" element={
          <PrivateRoute>
            <SavingsTranactions />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
