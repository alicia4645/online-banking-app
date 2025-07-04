import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

function App(){
    const [cards, setCards] = useState([]) 
    const [shownCards, setShownCards] = useState([])
    const [shownPins, setShownPins] = useState([])

    const navigate = useNavigate()

    const getCards = async() => {
        await axios.get("/api/cards/", 
            {withCredentials: true}
        ).then(response => {
            setCards(response.data.message)
        }).catch(error =>{
            console.log(error)
        })
    }

    const showCard = (index) => {
        if(shownCards.includes(index)){
            setShownCards(shownCards.filter(i => i !== index))
        }else{
            setShownCards([...shownCards, index])
        }
    }

     const showPin = (index) => {
        if(shownPins.includes(index)){
            setShownPins(shownPins.filter(i => i !== index))
        }else{
            setShownPins([...shownPins, index])
        }
    }

    useEffect(() =>{
        getCards()
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
                        <li>
                            <Link className="link" to="/">My Account</Link>
                        </li>
                        <li >
                            <Link className="link" to="/transactions">Transactions</Link>
                        </li>
                        <li >
                            <Link className="link" to="/transfers">Transfer</Link>
                        </li>
                        <li style={{backgroundColor:"rgb(241, 241, 241)"}}>
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
                <h1>Your Cards:</h1>
                {cards.map((card,index) => (
                    <div key={card.account.account_number}>
                        {shownCards.includes(index)? (
                            
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems:"center",
                                flexDirection:"column"
                            }}>
                                <div className="card">

                                    <div style={{backgroundColor:"black", width:"100%", height:"5vh"}}></div>
                                    
                                    <div className="details">
                                        <div style={{display:"flex", gap:"10px"}}>
                                            <div style={{backgroundColor:"white", width:"20vh"}}></div>
                                            {card.cvv}
                                        </div>
                                    
                                        <p style={{fontSize: "3vh", margin: 0 }}>{card.user.firstname} {card.user.lastname}</p>
                                        <p style={{fontSize: "3vh", margin: 0 ,letterSpacing: '2px', fontWeight: "bold" }}> {card.card_number}</p>
                                        <div style={{
                                            display:"flex", 
                                            flexWrap:"wrap",
                                            width:"35vh",
                                            
                                        }}>
                                            <div style={{display:"flex" , alignItems: "center" }}>
                                                <h6 style={{ margin: 0 }}>EXPIRY DATE</h6>
                                                <p style={{ margin: 0, marginLeft: "8px" }}> {card.expiry_date}</p>
                                            </div>
                                            <div style={{display:"flex",  alignItems: "center" }}> 
                                                <h6 style={{ margin: 0 }}>ACCOUNT</h6>
                                                <p style={{ margin: 0, marginLeft: "8px" , marginRight: "8px" }}>{card.account.account_number}</p>
                                            </div>
                                            <div style={{display:"flex", alignItems: "center" }}>
                                                <h6 style={{ margin: 0 }}>SORT CODE</h6>
                                                <p style={{ margin: 0, marginLeft: "8px" }}> {card.account.sort_code}</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                                 <div style={{display:"flex"}}>
                                    <button style={{width:"20vh"}}onClick={() => {showCard(index)}}>Hide details</button>
                                    <div>
                                        {shownPins.includes(index)? (
                                            <div style={{display:"flex"}}>
                                                <button style={{width:"20vh"}} onClick={() => {showPin(index)}}>Hide PIN</button>
                                                <div style={{ width:"10vh", textAlign:"center"}}>
                                                    <p style={{letterSpacing: '5px', fontWeight: "bold"}}>{card.pin}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <button style={{width:"20vh"}} onClick={() => {showPin(index)}}>Show PIN</button>
                                        )}
                                    </div>
                                </div>
                            </div>    
                        ) : (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems:"center",
                                flexDirection:"column"
                            }}>
                                <div className="card">
                                    <h2>{card.account.account_type} Account</h2>
                                    <p>{card.account.sort_code} / {card.account.account_number}</p>
                                </div>
                                <div style={{display:"flex"}}>
                                        <button style={{width:"20vh"}}onClick={() => {showCard(index)}}>Show details</button>
                                        <div>
                                            {shownPins.includes(index)? (
                                                <div style={{display:"flex"}}>
                                                    <button style={{width:"20vh"}} onClick={() => {showPin(index)}}>Hide PIN</button>
                                                    <div style={{ width:"10vh", textAlign:"center"}}>
                                                        <p style={{letterSpacing: '5px', fontWeight: "bold"}}>{card.pin}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button style={{width:"20vh"}} onClick={() => {showPin(index)}}>Show PIN</button>
                                            )}
                                        </div>
                                </div>
                            </div> 
                        )}
                    </div>
                ))}
               
            </div>
        </div>
    )
}

export default App