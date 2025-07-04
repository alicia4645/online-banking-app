import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link} from "react-router-dom"
import Table from 'react-bootstrap/Table'

function App(){
    const [transactions, setTransactions] = useState([])
   
   
    useEffect(() => {
        const getTransactions = async () => {
                await axios.get("/api/transactions/Savings/",
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


    return(
       <div style={{display:"flex"}} >
            <div className="menu">
                <div className="logo"></div>
                    <ul>
                        <li className="list" >
                            <Link to="/">My Account</Link>
                        </li>
                        <li className="list">
                            <Link to="/transactions">Transactions</Link>
                        </li>
                        <li className="list">
                            <Link to="/transfers">Transfer</Link>
                        </li>
                        <li className="list">
                           <Link to="/cards"> Manage Cards</Link>
                        </li>
                    </ul>
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
