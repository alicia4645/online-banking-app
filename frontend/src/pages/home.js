import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"


function App(){
    const [accounts, setAccounts] = useState([])
    const [user, setUser] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const getAccounts = async (e) => {
        axios.get("/api/account/",
            {withCredentials:true,}
        ).then(response => {
            setAccounts(response.data.message)
            setUser(response.data.message[0].user.firstname)
        }).catch(error => {
            console.log("error")
        })
    }
        getAccounts();
    }, [])
   

    const logout = async (e) => {
        axios.post("/api/logout/",
            {withCredentials:true}
        ).then(response => {
            navigate("/signin")
        })
        
    }

    return (
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
                <div>
                    <h1>Welcome {user}</h1>
                </div>

                {accounts.map(account => ( 
                    <div 
                        key={account.account_number} 
                        className="account" 
                        onClick={() => {
                            account.account_type === "Current" ? (
                                navigate("/currentTranactions")
                            ) : ( 
                                navigate("/savingsTranactions")
                            )
                        }}
                    >
                        <p>{account.account_type} Account</p>
                        <p style={{fontWeight:"bold", fontSize:"20px"}}>£{account.balance}</p>
                        <p>{account.sort_code} / {account.account_number}</p>
                    </div>
                ))}

                <div style={{
                    borderRadius: "30px",
                    backgroundColor: "rgb(123, 186, 241)",
                    padding:"10px",
                    marginBottom: "10px",
                    position: "absolute", 
                    bottom: "20px",
                    right:"20px",
                    left:"20px",
                }}
                onClick={()=> {navigate("/accounts")}}
                >
                    <h2>Eplore accounts</h2>
                    <p>View the available accounts our bank has to offer.</p>
                </div>
            </div>
        </div>

    )
}

export default App;

