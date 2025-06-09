import {useState} from "react"
import "../App.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"


function App (){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
        }

        axios.post("http://127.0.0.1:8000/api/signin/", user,{
                withCredentials: true,
            })
            .then(response => {
                setMessage(response.data.message);
                setError("");
                //open home page
            })
            .catch(error => {
                setError(error.response.data.error);
                setMessage("");
            })
    }


    return(
        <div className="container">
            <div className="forms">
                <h1>Sign In!</h1>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /> 
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    <div className="button-div">
                        <button type="submit" style={{backgroundColor: "#3B82F6"}}>Sign In</button>
                        <button role="link" onClick={() => navigate("/signup")}>Sign Up →</button>
                    </div>
                </form>           
            </div>
        </div>
    )
}

export default App;