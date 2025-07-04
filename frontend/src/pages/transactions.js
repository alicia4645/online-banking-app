import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

function App(){
    const [account, setAccount] = useState("")
    const [choosingAccount, setChoosingAccount] = useState(false)
    const [choosingRecipient, setChoosingRecipient] = useState(false)
    const [chosen, setChosen] = useState(false)
    const [payee, setPayee] = useState("")
    const [sortCode, setSortCode] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [error, setError] = useState("")
    const [amount, setAmount] = useState("")
    const [success, setSuccess] = useState(false)
    const [allAccounts, setAllAccounts] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const getAccounts = async (e) => {
            axios.get("/api/account/",
                {withCredentials:true,}
            ).then(response => {
                setAccount(response.data.message[0])
                setAllAccounts(response.data.message)
            }).catch(error => {
                setError("An error has occured. Please try again.")
                console.log(error)
            })
    }
        getAccounts();
    }, [])
    
    const handlePayeeSubmit = (e) => {
        e.preventDefault()
        if(validateAccountNumber() && validatePayee() && validateSortCode()){
            setChoosingRecipient(false)
            setChosen(true)
        }        
    }

    const validatePayee = () => {
        if(!payee.match(/^[A-Za-z\s-]+$/)){
            setError("Invalid payee name")
        }
        return payee.match(/^[A-Za-z\s-]+$/)
    }

    const validateSortCode = () => {
        if(sortCode.toString().length !== 6 || !sortCode.match(/^\d+$/)){
            setError("Invalid sort code")
        }
        return sortCode.length === 6 && sortCode.match(/^\d+$/)
    }

    const validateAccountNumber = () => {
        if(accountNumber.toString().length !== 8 || !accountNumber.match(/^\d+$/)){
            setError("Invalid account number")
        }
        return accountNumber.length === 8 && accountNumber.match(/^\d+$/)
    }

    const transaction = {
        sender: account,
        receiver: {
            account_number: accountNumber,
            sort_code: sortCode,
            user: payee
        },
        amount: amount
    }

    const makeTransaction = async () => {
        await axios.post("/api/transactions/", transaction,
                {withCredentials: true}
            ).then(response => {
                setError("")
                setSuccess(true)
            }).catch(error => {
                setError(`Transaction has failed! ${error.error}`)
            }
        )
    } 

    const changeAccounts = (account) => {
        setAccount(account)
        setChoosingAccount(false)
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
                        <li>
                            <Link className="link" to="/">My Account</Link>
                        </li>
                        <li style={{backgroundColor:"rgb(241, 241, 241)"}} >
                            <Link className="link" to="/transactions">Transactions</Link>
                        </li>
                        <li >
                            <Link className="link" to="/transfers">Transfer</Link>
                        </li>
                        <li >
                           <Link className="link" to="/cards"> Manage Cards</Link>
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
                {success && <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
                    <div className="success">
                        <h2>Transaction Successful!</h2>
                        <button onClick={() => navigate("/")}>Continue</button>
                    </div>
                </div>}
                {choosingAccount && !choosingRecipient && !success &&  <div>
                    {allAccounts.map(account => (
                        <div key={account.account_number} className="account" onClick={(e) => changeAccounts(account)}>
                            <p>{account.account_type} Account</p>
                            <p style={{fontWeight:"bold", fontSize:"20px"}}>£{account.balance}</p>
                            <p>{account.sort_code} / {account.account_number}</p>
                        </div>
                    ))}
                    </div>}
                {!choosingAccount && !choosingRecipient && !success && 
                    <div>
                        <h1>Transactions</h1>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <h2>From:</h2>
                        <div className="account">
                            <p>{account.account_type} Account</p>
                            <p>{account.sort_code} / {account.account_number}</p>
                            <p style={{fontWeight:"bold", fontSize:"20px"}}>£{account.balance}</p>
                        </div>
                        <button onClick={() => setChoosingAccount(true)}>Change account</button>

                        <h2>To:</h2>
                        <div className="account" onClick={() => setChoosingRecipient(true)}>
                            {chosen ? 
                                <div className="account">
                                    <p>{payee}</p>
                                    <p>{sortCode} / {accountNumber}</p>
                                </div>
                                :
                                <p>Choose who to pay</p>
                            }
                        </div>

                        {chosen && !success && <>
                                <div className="amount">
                                    <input className="amountInput"  placeholder="amount" onChange={(e) => setAmount(e.target.value)} required></input>
                                </div>
                                <button onClick={ makeTransaction}>Continue</button>
                            </>

                            
                        }
                    </div>
                }   
                {!choosingAccount && choosingRecipient && !success &&
                    <div>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <h2>Enter payee details</h2>
                            <button onClick={() => {
                                setChoosingRecipient(false)
                                setError("")
                                setAccountNumber("")
                                setPayee("")
                                setSortCode("")
                                setChosen(false)
                                
                                }}>Cancel</button>
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <form onSubmit={handlePayeeSubmit}>
                            <input placeholder="Payee name:" value={payee} onChange={(e) => setPayee(e.target.value)} required></input>
                            <input placeholder="Sort code:" value={sortCode} onChange={(e) => setSortCode(e.target.value)} required></input>
                            <input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required></input>
                            <button type="submit">Continue</button>
                        </form>
                    </div>
                }
            </div>
        </div>
        
        
    )
}

export default App;