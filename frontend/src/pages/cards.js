import {useEffect, useState} from "react"
import "../App.css"
import axios from "axios"
import {Link} from "react-router-dom"
function App(){
    const [cards, setCards] = useState([]) 
    const [shownCards, setShownCards] = useState([])
    const [shownPins, setShownPins] = useState([])

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
                        <li className="list"  style={{backgroundColor:"rgb(241, 241, 241)"}}>
                           <Link to="/cards"> Manage Cards</Link>
                        </li>
                    </ul>
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