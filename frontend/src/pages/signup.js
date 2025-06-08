import {useState} from "react"
import "../App.css"
import axios from "axios"
import validator from "validator"

function App(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => { 
        e.preventDefault();
                
        if(validateEmail(email) && validatePassword(password) ){
            //user object 
            const user = {
                firstname: firstName,
                lastname: lastName,
                username: username,
                email: email,
                password: password
            }

            axios.post("http://127.0.0.1:8000/api/signup/", { user })
                .then(response => {
                    setMessage(response.data.message)
                    setError("")   
                })
                .catch(error => {
                    setError(error.response.data.error)
                    setMessage("")
                } )


            clearForm(); 
        }
    }; 

    const clearForm = () => { 
        setFirstName(""); 
        setLastName(""); 
        setUsername("");
        setEmail(""); 
        setPassword(""); 
    }; 

    const validateEmail = () => {
        if(!validator.isEmail(email)){
            setError("Invalid email");
            setMessage("");
        }else{
           setError(""); 
        }
        return validator.isEmail(email);
    }

    const validatePassword = () => {
        if(!password.length < 8){
            setError("Password must be 8 or more characters");
            setMessage("");
        }else{
           setError(""); 
        }

       return password.length>=8;
    }

    return(
        <div className="container">
            <div className="forms">
                <h2>Sign Up!</h2>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>First name:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    <label>Last name:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <label>Password:</label>
                    <input type= "password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    
                    <div className="button-div">
                        <button type="submit" style={{backgroundColor: "#3B82F6"}}>Sign Up</button>
                        <button>Sign In →</button>
                    </div>
                    
                </form>
            </div>
        </div>
        
    );
}

export default App;