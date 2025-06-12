import {useState} from "react"
import "../App.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"


function App (){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
        }

        axios.post("/api/signin/", user,{
                withCredentials: true,
            })
            .then(() => {
                setError("")
                //open home page
                navigate("/")
            })
            .catch(error => {
                console.log(error)
                setError(error.response.data.error);
            })
    }

    return(
        <div className="container">
            <div className="forms">
                <h1>Sign In!</h1>
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