import {React, useState} from 'react'
import './Card.css'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NewMark from './NewMark'
import StarRateIcon from '@mui/icons-material/StarRate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';

function shortenString(str, maxLength = 10) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}
function handleFavorite({ userID, contractAddress, contractName, setIsFavorited }) {
    //console.log({ userID, contractAddress, contractName });
    setIsFavorited(true)
    axios.post('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/contracts/addContract', {
      userId: userID,
      contractAddress: contractAddress,
      contractName: contractName
    })
    .then(response => {
      //console.log('Success:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function checkFavorites(props) {
    if (Array.isArray(props.favorites)) {
        return props.favorites.some((favorite) => favorite.contract_address === props.address);
    }
    return false;
}


const chart = "https://dexscreener.com/ethereum/"
const uniswap = "https://app.uniswap.org/swap?outputCurrency="
const etherscan = "https://etherscan.io/address/"



function Card (props) {
    const [isFavorited, setIsFavorited] = useState(false)
    return(

        <div className="card-container">
            <div className="top-icons">
                <NewMark/>
                {props.isLoggedIn && !checkFavorites({
                    address: props.coin.address,
                    favorites: props.favorites
                }) && <div className="star" onClick={()=>handleFavorite({
                    contractAddress: props.coin.address,
                    userID: props.userID,
                    contractName: props.coin.name,
                    setIsFavorited: setIsFavorited    
                })}>
                {!isFavorited && <StarRateIcon/>}
                </div>}
            </div>
            <h1 className="card-title" onClick={()=>props.onCoinSelect(props.coin)}>{shortenString(props.coin.name)}</h1>
            <div className="ether-container" onClick={()=> window.open(etherscan+props.coin.address)}>
                <InfoOutlinedIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-ether" >etherscan</button>
            </div>
            <div className="swap-container" onClick={()=> window.open(uniswap+props.coin.address)}>
                <SwapHorizIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-swap" >buy on uniswap</button>
            </div>
            <div className="address-container" onClick={()=> navigator.clipboard.writeText(props.coin.address)}>
                <ContentCopyIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-address" >copy address</button>
            </div>
            <div className="chart-container" onClick={()=> window.open(chart+props.coin.address)}>
                <ShowChartIcon fontSize="small" style={{cursor: 'pointer'}}/>
                <button className="card-chart" >chart</button>
            </div>
            
        </div>
    )
}

export default Card