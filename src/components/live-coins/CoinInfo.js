import {React, useState, useEffect} from 'react'

function CoinInfo (props) {


    //console.log(props.coin.usdPrice)
    return(
        <div className="coin-info">
                <h1 className="coin-info-name">{props.coin.name}</h1>
                <h2 className="coin-info-details">price: {props.coin.usdPrice > 0 ? props.coin.usdPrice : "no liquidity added."}</h2>
                <h2 className="coin-info-details">liquidity: {props.coin.liquidity > 0 ? props.coin.liquidity : "no liquidity added."}</h2>
                <h2 className="coin-info-details">verified: {props.coin.verified ? "yes" : "no"}</h2>
            </div>
    )
}

export default CoinInfo