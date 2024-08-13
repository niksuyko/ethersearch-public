import React, { useState, useEffect } from 'react';
import './TrendingCoins.css';
import TrendingCoin from './TrendingCoin';

function TrendingCoinsList() {
    const [gainers, setGainers] = useState([]);
    let key = 0

    useEffect(() => {
        fetch('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/trending')
            .then(response => response.json())
            .then(data => {
                setGainers(data.gainers);
            })
            .catch(error => {
                console.error('Error fetching trending data:', error);
            });
    }, []);

    return (
        <div className="trending-section">
            <h1 className="trending-title">trending coins</h1>
            {gainers.map((coin) => (
                <TrendingCoin key={key+=1} coin={coin} />
            ))}
        </div>
    );
}

export default TrendingCoinsList;
