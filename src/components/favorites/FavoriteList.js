import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FavoriteCoin from './FavoriteCoin'

import { UserContext } from '../../App'



function FavoriteList(props) {
  const { favorites, userID, setFavorites } = React.useContext(UserContext);
  const handleRemoveFavorite = (props) => {
    
    //console.log(props)
    //console.log(favorites)
    axios.post('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/contracts/removeContract', {
      userId: props.userId,
      contractAddress: props.address,
    })
    .then(response => {
      console.log('Success:', response.data);
      setFavorites(favorites.filter(coin => coin.contract_address !== props.address));
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    //console.log("FAVORITE EFFECT RAN");

    const fetchContracts = async () => {
      try {
        const response = await axios.get(`https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/contracts/getUserContracts`, {
          params: { userId: userID }
        });
        if (response.data.contracts.length > 0) {
          setFavorites(response.data.contracts);
        } else {
          console.error('No contracts found for the user');
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, []);
  
  return (
    <>
    <div className="list-container">
        {favorites.map((coin)=>(
          <FavoriteCoin userId={userID} key={coin.contract_address} address={coin.contract_address} name={coin.contract_name} onCoinSelect={props.onCoinSelect} handleRemoveFavorite={handleRemoveFavorite}/>
        ))}
        </div>
    </>
  );
}


export default FavoriteList