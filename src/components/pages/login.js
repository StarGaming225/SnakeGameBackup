import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(username === "" || password === "") {
            setError(true);
            setErrorMessage("Error: All fields must be filled in")
        } else {
            fetch('https://esnakeapi.herokuapp.com/user/verify', {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({
                    username,
                    password
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data === 'User NOT verified') {
                    setError(true);
                    setErrorMessage('User NOT verified');
                } else if(data === 'User has been verified') {
                    props.handleSuccessfulLogin()
                    Cookies.set('username', username);
                    props.history.push("/game-menu");
                }
            })
            .catch(error => {
                console.log("Error logging in", error);
                setError(true);
                setErrorMessage('Error logging in, please try again')
            })
        }
    }

    useEffect(() => {
        setError(false);
        setErrorMessage('');
    }, [username, password])

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h1 className="form-title">Login</h1>
                <form className="form" onSubmit={(e) => handleSubmit(e)}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    autoComplete="off"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="form-button" type="submit">Submit</button>
                </form>
                <h3 style={{visibility: error ? 'visible' : 'hidden'}}>{errorMessage}</h3>
            </div>
        </div>
    );
}