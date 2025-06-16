import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"


function App(){
    const [accounts, setAccounts] = useState([])
    const [user, setUser] = useState("")
    
    useEffect(() => {
        const getAccounts = async (e) => {
        axios.get("/api/account/",
            {withCredentials:true,}
        ).then(response => {
            setAccounts(response.data.message)
            setUser(response.data.message[0].user.firstname)
            console.log(response.data.message[0].user.firstname)
        }).catch(error => {
            console.log("error")
        })
    }
        getAccounts();
    }, [])
   
    return (
        <div style={{display:"flex"}} >
            <div className="menu">
                <div className="logo"></div>
                <ul>
                    <li className="list" style={{backgroundColor:"rgb(241, 241, 241)"}}>My Account</li>
                    <li className="list">Transactions</li>
                    <li className="list">Transfer</li>
                    <li className="list">Manage Cards</li>
                </ul>
            </div>
            <div className="main">
                <div>
                    <h1>Welcome {user}</h1>
                </div>

                {accounts.map(account => ( 
                    <div key={account.account_number} className="account">
                        <p>{account.account_type} Account</p>
                        <p style={{fontWeight:"bold", fontSize:"20px"}}>£{account.balance}</p>
                        <p>{account.sort_code} / {account.account_number}</p>
                    </div>
                    ))}
            </div>
        </div>

    )
}

export default App;

