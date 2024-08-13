
import React, {useState, useEffect} from 'react';
import './App.css';
import Home from './pages/Home'
import axios from 'axios'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

export const UserContext = React.createContext(null);
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    //console.log("FAVORITE EFFECT RAN");

    const fetchContracts = async () => {
      if (!userID) {
        //console.error('No favorites: user not logged in.')
        return;
      }
    
      try {
        const response = await axios.get('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/contracts/getUserContracts', {
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
  }, [userID]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // decode token to extract user information (you might want to use a library like jwt-decode)
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // basic token decoding, not for production
        setUsername(decodedToken.username);
        setUserID(decodedToken.id);
        setIsLoggedIn(true);
    }
}, []);

    return (
    
      <Router>
        <UserContext.Provider value = {{ favorites: favorites, setFavorites: setFavorites, isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, username: username, setUsername: setUsername, setUserID: setUserID, userID: userID}}>
          <Routes>
            <Route exact path ="/" element ={<Home/>}/>
          </Routes>
        </UserContext.Provider>
      </Router>
    );
}

export default App;
