import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

function App(){
    const [accounts, setAccounts] = useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()
    
    useEffect(() => {
        const getAccounts = async (e) => {
            axios.get("/api/account/",
                {withCredentials:true,}
            ).then(response => {
                setAccounts(response.data.message)
            }).catch(error => {
                console.log(error)
            })
    }
        getAccounts();
    }, [])


    const addAccount = async (type) =>{

        const exists = accounts.some(account => account.account_type === type)
    
        if(exists){
            setMessage("")
            setError("You already have this account")
            return
        }
        
        await axios.post("/api/account/",
            {"account_type":type}
        ).then(response => {
            setError("")
            setMessage(response.data.message)
        }).catch(error => {
            console.log(error)
            setMessage("")
            setError("An error has occured")
        })
    }

    const logout = async (e) => {
        axios.post("/api/logout/",
            {withCredentials:true}
        ).then(response => {
            navigate("/signin")
        })
        
    }


    return(
       <div style={{display:"flex"}} >
            <div className="menu">
                <div className="logo"></div>
                <div style={{
                    display:"flex", 
                    flexDirection:"column",
                    justifyContent:"space-between",
                    height:"80%",
                }}>
                     <ul>
                        <li style={{backgroundColor:"rgb(241, 241, 241)"}}>
                            <Link to="/">My Account</Link>
                        </li>
                        <li >
                            <Link to="/transactions">Transactions</Link>
                        </li>
                        <li >
                            <Link to="/transfers">Transfer</Link>
                        </li>
                        <li >
                           <Link to="/cards"> Manage Cards</Link>
                        </li>
                    </ul>

                    <ul>
                        <li onClick={logout}>
                            Sign Out
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="main">
                <h1>Choose from our available accounts</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                <div className="account" style={{position:"relative"}}>
                    <h2>Current Account</h2>
                    <p>Our current account ideal for everyday use for regular transactions.</p>
                    <br></br>
                    <button 
                        style={{position:"absolute", right:"20px", bottom:0}}
                        onClick={() => {addAccount("Current")}}
                    >
                        Add Account
                    </button>
                </div>

                <div className="account" style={{position:"relative"}}>
                    <h2>Savings Account</h2>
                    <p>Our savings account designed to help you save money over time whilst earning interest on your balance.</p>
                    <br></br>
                    <button 
                        style={{position:"absolute", right:"20px", bottom:0}}
                        onClick={() => {addAccount("Savings")}}
                    >
                        Add Account
                    </button>
                </div>

            </div>
        
        </div>
    )
}

export default App