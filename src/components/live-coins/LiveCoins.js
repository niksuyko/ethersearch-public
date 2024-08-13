import {React, useState, useEffect} from 'react'
import CardList from './CardList'
import './LiveCoins.css'
import CoinInfo from './CoinInfo'
import useWebSocket from 'react-use-websocket'; // import websocket hook
import axios from 'axios';
import FavoriteList from '../favorites/FavoriteList'

function LiveCoins ({isFavTab}) {

    const coin = {
        name:"select a coin",
        address:"0xdAC17F958D2ee523a2206206994597C13D831ec7",
        telegram:"https://telegram.me/TetherUSD",
        uniswap:"https://app.uniswap.org/swap?outputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7",
        etherscan:"https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
    const { lastMessage, readyState } = useWebSocket('wss://ws.ethersear.ch:5001'); // websocket connection
    const [contracts, setContracts] = useState([]); // state for contracts
    //console.log(contracts)
    const [selectedCoin, setSelectedCoin] = useState(coin);
    //console.log("rendered")

    useEffect(() => {
        if (lastMessage !== null) {
            fetchLatestContracts();
        }
    }, [lastMessage]);
    
    const fetchLatestContracts = async () => {
        try {
            const response = await fetch('https://ws.ethersear.ch:5001/api/contracts');
            const data = await response.json();
            setContracts(data.reverse());
        } catch (error) {
            console.error('Error fetching latest contracts:', error);
        }
    };

    
    const handleCoinSelect = async (coin) => {
        setSelectedCoin(coin)
        try {
            const response = await axios.get('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/liveCoin', {
                params: { address: coin.address }
            });
            setSelectedCoin(prevCoin=>({
                ...prevCoin,
                usdPrice: response.data.usdPrice,
                liquidity: response.data.pairTotalLiquidityUsd,
                verified: response.data.verifiedContract
            }
        ));
        } catch (error) {
            console.error(`Error fetching price for contract ${coin.address}:`, error);
        }
        console.log(selectedCoin)
    }

    const handleFavoriteSelect = async (coin) => {
        console.log("FAVORITE COIN IS: ", coin)
        setSelectedCoin(coin)
        try {
            const response = await axios.get('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/liveCoin', {
                params: { address: coin.address, name: coin.name }
            });
            setSelectedCoin(prevCoin=>({
                ...prevCoin,
                usdPrice: response.data.usdPrice,
                liquidity: response.data.pairTotalLiquidityUsd,
                verified: response.data.verifiedContract
            }
        ));
        } catch (error) {
            console.error(`Error fetching price for contract ${coin.address}:`, error);
        }
        console.log(selectedCoin)
    }

    //console.log("FAV TAB IS: ")
    return(
        <div className="left-container">
            <div className="live-section">
                <h1 className="live-title">{!isFavTab? "live erc20 tracker" : "favorites"}</h1>
                <div className="live-list">
                    {!isFavTab && <CardList coinList={contracts} onCoinSelect={handleCoinSelect}/>}
                    {isFavTab && <FavoriteList onCoinSelect={handleFavoriteSelect}/>}
                </div>
            </div>
            <CoinInfo coin={selectedCoin}/>
        </div>
        
    )
}

export default LiveCoins