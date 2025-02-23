import { useState } from "react"
import MobileMoney from "./MobileMoney"
import CardPayment from "./CardPayment"
import CryptoPayment from "./CryptoPayment"

function Donate({onClose,projectId}:{onClose:any,projectId:string}) {
    const [mobileMoney,setMobileMoney]=useState(true)
    const [card,setCard]=useState(false)
    const [crypto,setCrypto]=useState(false)
    


  return (
    <div className="">
      {
        mobileMoney && (
          <MobileMoney 
            projectId={projectId}
            onClose={onClose}
            setMobileMoney={setMobileMoney}
            mobileMoney={mobileMoney}
            setCard={setCard}
            card={card}
            crypto={crypto}
            setCrypto={setCrypto}
          />
        )
      }
      {
        card && (
          <CardPayment 
            onClose={onClose}
            setMobileMoney={setMobileMoney}
            mobileMoney={mobileMoney}
            setCard={setCard}
            card={card}
            crypto={crypto}
            setCrypto={setCrypto}
          />
        )
      }
      {
        crypto && (
          <CryptoPayment 
            onClose={onClose}
            setMobileMoney={setMobileMoney}
            mobileMoney={mobileMoney}
            setCard={setCard}
            card={card}
            crypto={crypto}
            setCrypto={setCrypto}
          />
        )
      }
    </div>
  )
}

export default Donate