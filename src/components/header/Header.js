import React, { useState, useEffect, useContext } from 'react';
import './Header.css';
import Modal from '../modal/Modal';
import LoginModal from '../modal/LoginModal';
import { UserContext } from '../../App'

function Header({setIsFavTab, isFavTab}) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { setUsername, username, setIsLoggedIn, isLoggedIn, setUserID } = useContext(UserContext);
    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };


    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };
    const handleRegister = async (userData) => {
        try {
            const response = await fetch('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                //console.log('User registered:', data);
                closeRegisterModal();
                handleLogin({
                    username: userData.username,
                    password: userData.password
                })
            } else {
                console.error('Registration failed');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleLogin = async (loginData) => {
        try {
            const response = await fetch('https://yq0eke7wa8.execute-api.us-east-1.amazonaws.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                const token = localStorage.getItem('token');
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUsername(loginData.username);
                setUserID(decodedToken.id)
                setIsLoggedIn(true);
                closeLoginModal();
            } else {
                console.error('Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
        setUserID(null);
        setIsFavTab(false);
    };

    

    return (
        <>
            <div className="header">
                <h1 className="header-title">ethersear.ch</h1>
                <div className="user-options">
                    {isLoggedIn ? (
                        <>
                            <h1 className="header-username">{username}</h1>
                            <h1 style={{ fontWeight: '200' }}>|</h1>
                            {isFavTab ? <button className="header-favorites" onClick={()=>setIsFavTab(false)}>home</button> : <h1 className="header-favorites" onClick={()=>setIsFavTab(true)}>favorites</h1>}
                            <h1 style={{ fontWeight: '200' }}>|</h1>
                            <button className="header-login" onClick={handleLogout}>
                                logout
                            </button>
                            
                        </>
                    ) : (
                        <>
                            <button className="header-login" onClick={openLoginModal}>login</button>
                            <h1 style={{ fontWeight: '200' }}>|</h1>
                            <button className="header-register" onClick={openRegisterModal}>
                                register
                            </button>
                        </>
                    )}
                    
                </div>
            </div>
            {isRegisterModalOpen && (
                <Modal closeRegisterModal={closeRegisterModal} handleRegister={handleRegister} />
            )}
            {isLoginModalOpen && (
                <LoginModal closeLoginModal={closeLoginModal} handleLogin={handleLogin} />
            )}
        </>
    );
}

export default Header;
