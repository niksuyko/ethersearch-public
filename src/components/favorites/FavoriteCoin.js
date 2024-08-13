import React from 'react'
import './FavoriteCoin.css'
import '../live-coins/live-card/Card.css'

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import StarRateIcon from '@mui/icons-material/StarRate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { UserContext } from '../../App'

function shortenString(str, maxLength = 11) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}


function FavoriteCoin (props) {

    const setFavorites = React.useContext(UserContext)
    

const chart = "https://dexscreener.com/ethereum/"
const uniswap = "https://app.uniswap.org/swap?outputCurrency="
const etherscan = "https://etherscan.io/address/"

    return (
        
            <div className="favorite-container">
            <div className="top-icons">
                <div className="star"><RemoveIcon onClick={()=>props.handleRemoveFavorite(props)}/></div>
            </div>
            <h1 className="card-title" onClick={()=>props.onCoinSelect(props)}>{shortenString(props.name)}</h1>
            <div className="ether-container" onClick={()=> window.open(etherscan+props.address)}>
                <InfoOutlinedIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-ether" >etherscan</button>
            </div>
            <div className="swap-container" onClick={()=> window.open(uniswap+props.address)}>
                <SwapHorizIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-swap" >buy on uniswap</button>
            </div>
            <div className="address-container" onClick={()=> navigator.clipboard.writeText(props.address)}>
                <ContentCopyIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-address" >copy address</button>
            </div>
            <div className="chart-container" onClick={()=> window.open(chart+props.address)}>
                <ShowChartIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-chart" >chart</button>
            </div>
            
        </div>



    )
}

export default FavoriteCoin