import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import LiveCoins from '../components/live-coins/LiveCoins';
import TrendingCoinsList from '../components/trending/TrendingCoinsList';

function Home() {
    const [isFavTab, setIsFavTab] = useState(false);
    const [isWideEnough, setIsWideEnough] = useState(window.innerWidth >= 600);

    useEffect(() => {
        const handleResize = () => {
            setIsWideEnough(window.innerWidth >= 600);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Header setIsFavTab={setIsFavTab} isFavTab={isFavTab} />
            <div className="page-content">
                <LiveCoins isFavTab={isFavTab} />
                {isWideEnough && <TrendingCoinsList />}
            </div>
        </>
    );
}

export default Home;
