import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import Table from 'react-bootstrap/Table'

function App(){
    const [transactions, setTransactions] = useState([])
   const navigate = useNavigate()
   
    useEffect(() => {
        const getTransactions = async () => {
                await axios.get("/api/transactions/Current/",
                {withCredentials:true}
            ).then(response => {
                console.log(response.data.message)
                setTransactions(response.data.message)
            }).catch(error =>{
                console.log(error)
            })    
        }
        getTransactions()
    }, [])

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
                        <li >
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
                <h1>Transaction History</h1>
                <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <Table striped  hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Counterparty</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.account.user.firstname} {transaction.account.user.lastname}</td>
                                    <td>
                                        {transaction.action === "Sending" ? (
                                                <p>- {transaction.amount}</p>
                                            ) : (
                                                <p style={{color:"green", fontWeight:"bold"}}>+ {transaction.amount}</p>
                                        )}   
                                        <p style={{fontSize:"10px"}}>{transaction.user.balance}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
            
)
}

export default App
