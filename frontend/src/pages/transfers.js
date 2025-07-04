import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

function App(){
    const [account, setAccount] = useState("")
    const [allAccounts, setAllAccounts] = useState([])
    const [success, setSuccess] = useState(false)
    const [choosingSendingAccount, setChoosingSendingAccount] = useState(false)
    const [choosingReceivingAccount, setChoosingReceivingAccount] = useState(false)
    const [error, setError] = useState("")
    const [chosen, setChosen] = useState(false)
    const [accountType, setAccountType] = useState("")
    const [sortCode, setSortCode] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [amount, setAmount] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const getAccounts = async (e) => {
            axios.get("/api/account/",
                {withCredentials:true,}
            ).then(response => {
                setAccount(response.data.message[0])
                setAllAccounts(response.data.message)
            }).catch(error => {
                setError(`Transaction has failed! ${error.error}`)
            })
    }
        getAccounts();
    }, [])


    const transaction = {
        sender: account,
        receiver: {
            account_number: accountNumber,
            sort_code: sortCode,
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
                setError("Transaction has failed! Please check all details are correct.")
                console.log(error)
            }
        )
    } 

    const chooseRecieving = (account) => {
        setAccountType(account.account_type)
        setAccountNumber(account.account_number)
        setSortCode(account.sort_code)
        setChoosingReceivingAccount(false)
        setChosen(true)
    }

    const chooseSending = account => {
        setAccount(account)
        setChoosingSendingAccount(false)

        if(account.account_number === accountNumber){
            setChosen(false)
        }

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
                        <li >
                            <Link className="link" to="/transactions">Transactions</Link>
                        </li>
                        <li style={{backgroundColor:"rgb(241, 241, 241)"}}>
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

                {allAccounts.length === 1 ? <h2>You cannot transfer money between accounts as you only have 1 account with us</h2> :(
                    <>
                        {!success && !choosingSendingAccount && !choosingReceivingAccount &&
                            <div>
                                <h1>Transfer</h1>
                                <h2>From:</h2>
                                <div className="account">
                                    <p>{account.account_type} Account</p>
                                    <p>{account.sort_code} / {account.account_number}</p>
                                    <p style={{fontWeight:"bold", fontSize:"20px"}}>£{account.balance}</p>
                                </div>
                                <button onClick={() => setChoosingSendingAccount(true)}>Change account</button>

                                <h2>To:</h2>
                            
                                <div className="account" onClick={() => setChoosingReceivingAccount(true)}>
                                    {chosen ? 
                                        <div className="account">
                                            <p>{accountType} Account</p>
                                            <p>{sortCode} / {accountNumber}</p>
                                        </div>
                                        :
                                        <p>Choose from your accounts</p>
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

                        {!success && !choosingSendingAccount && choosingReceivingAccount &&
                            <div>
                                <h2>Choose from your accounts:</h2>
                                {allAccounts.map(chosen => (  chosen !== account &&
                                <div key={chosen.account_number} onClick={() => chooseRecieving(chosen)} className="account">
                                    <p>{chosen.account_type} Account</p>
                                    <p>{chosen.sort_code} / {chosen.account_number}</p>
                                    <p style={{fontWeight:"bold", fontSize:"20px"}}>£{chosen.balance}</p>
                                </div>
                                ))}
                            </div>
                        }

                        {!success && choosingSendingAccount && !choosingReceivingAccount &&
                            <div>
                                <h2>Choose from your accounts:</h2>
                                {allAccounts.map(chosen => ( 
                                <div key={chosen.account_number} onClick={() => chooseSending(chosen)} className="account">
                                    <p>{chosen.account_type} Account</p>
                                    <p>{chosen.sort_code} / {chosen.account_number}</p>
                                    <p style={{fontWeight:"bold", fontSize:"20px"}}>£{chosen.balance}</p>
                                </div>
                                ))}
                            </div>
                        }
                    </>)
                }

            </div>
        </div>
    )
}

export default App;