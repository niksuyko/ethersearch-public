import {useState} from 'react'
import React from 'react'
import './Modal.css'
import axios from 'axios'
import { FullscreenExitRounded } from '@mui/icons-material';

function Modal ({closeLoginModal, handleLogin}) {

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeLoginModal();
        }
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const [success, setSuccess] = useState(true);

    function handleChange(event){
        setFormData(prevFormData => {
            const {name, type} = event.target
            return{
                ...prevFormData,
                [event.target.name]: event.target.value
            }
            
        })
    }

    function handleSubmit() {
        handleLogin(formData);
    }

    return (
        <div className="register-modal-container" onClick={handleBackgroundClick}>
            <div className="register-modal" onClick={(e)=> e.stopPropagation()}>
                <h1 className="register-text">login to ethersearch</h1>
                <form className="register-form">
                    <label>
                        <input className="username-input"placeholder="username" type="text" name="username" onChange={handleChange} value={formData.username} />
                    </label>
                    <label>
                        <input className="password-input" placeholder ="password" type="password" name="password" onChange={handleChange} value={formData.password}/>
                    </label>
                    
                    <button onClick={handleSubmit} className="submit-button" type="button" value="submit" >login</button>
                </form>
            </div>
        </div>
    )
}

export default Modal;