import React from 'react'
import './TrendingCoins.css'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShowChartIcon from '@mui/icons-material/ShowChart';

function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num.toString();
    }
}

function shortenString(str, maxLength = 10) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}

function toPercentage(num, decimals = 1) {
    return (num * 1).toFixed(decimals) + '%';
}

function TrendingCoin (props) {

    const chart = "https://dexscreener.com/ethereum/"
    const uniswap = "https://app.uniswap.org/swap?outputCurrency="
    const etherscan = "https://etherscan.io/address/"

    return (
        <div className="trending-coin">
                <img src={props.coin.token_logo} className="trending-logo" onClick={()=> window.open(etherscan+props.coin.contract_address)}></img>
                <h2 className="trending-coin-name" onClick={()=> window.open(etherscan+props.coin.contract_address)}>{shortenString(props.coin.token_name)}</h2>
                <h2 className="trending-mcap"> mcap: {formatNumber(props.coin.market_cap_usd)}</h2>
                <h1 className="trending-price">USD: {props.coin.price_usd}</h1>
                <h2 className="trending-24">past 24h: {toPercentage(props.coin.price_24h_percent_change)}</h2>
                
                <div className="trending-icons">
                    <SwapHorizIcon style={{cursor: 'pointer'}}fontSize="small" onClick={()=> window.open(uniswap+props.coin.contract_address)}/>
                    <ContentCopyIcon style={{cursor: 'pointer'}} fontSize="small" onClick={()=> navigator.clipboard.writeText(props.coin.contract_address)}/>
                    <ShowChartIcon style={{cursor: 'pointer'}} fontSize="small" onClick={()=> window.open(chart+props.coin.contract_address)}/>
                </div>
                
            </div>
    )
}
export default TrendingCoin
