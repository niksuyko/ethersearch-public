import React from 'react'
import Card from './live-card/Card'
import { UserContext } from '../../App';
function CardList(props) {

  const { userID, isLoggedIn, favorites } = React.useContext(UserContext)
  return (
    <>
      <div className="list-container">
        {props.coinList.map((coin) => (
          <Card key={coin.address} coin={coin} onCoinSelect={props.onCoinSelect} userID={userID} isLoggedIn={isLoggedIn} favorites={favorites} />
        ))}
      </div>
    </>
  );
}


export default CardList