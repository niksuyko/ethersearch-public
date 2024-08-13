import React from 'react'
import {useState} from 'react'
import './Modal.css'

function Modal ({closeRegisterModal, handleRegister}) {

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeRegisterModal();
        }
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const [emailValid, setEmailValid] = useState(true);

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
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setEmailValid(false);
            return;
        }
        handleRegister(formData);
    }
    
    

    return (
        <div className="register-modal-container" onClick={handleBackgroundClick}>
            <div className="register-modal" onClick={(e)=> e.stopPropagation()}>
                <h1 className="register-text">register on ethersearch to...</h1>
                <h2 className="register-description">- view and save favorites -</h2>
                <h2 className="register-description">- compare performance -</h2>
                <h2 className="register-description">- see trends -</h2>
                <form className="register-form">
                    <label>
                        <input className="email-input" placeholder ="email" type="email" name="email" onChange={handleChange} value={formData.email}/>
                    </label>
                    <label>
                        <input className="username-input"placeholder="username" type="text" name="username" onChange={handleChange} value={formData.username} />
                    </label>
                    <label>
                        <input className="password-input" placeholder ="password" type="password" name="password" onChange={handleChange} value={formData.password}/>
                    </label>
                    
                    <button onClick={handleSubmit} className="submit-button" type="button" value="submit" >register</button>
                </form>
                {!success && <h2 className="login-failed">user already exists</h2>}
                {!emailValid && <h2 className="login-failed">invalid email</h2>}
            </div>
        </div>
    )
}

export default Modal;