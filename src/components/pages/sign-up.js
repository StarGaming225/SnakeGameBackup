import React, { useState, useEffect } from 'react';
import { navigate } from 'hookrouter';
import Cookies from 'js-cookie';

export default function SignUp(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const times_played = 0;
    const longest_length = 0;
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(username === "" || password === "" || confirmPassword === "") {
            setError(true);
            setErrorMessage("Error: All fields must be filled in")
        } else if(password !== confirmPassword) {
            setError(true);
            setErrorMessage("Error: Passwords are not the same")
        } else {
            fetch('https://esnakeapi.herokuapp.com/user/add', {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({
                    username,
                    password,
                    longest_length,
                    times_played
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data === 'Error: That Username is taken') {
                    setError(true);
                    setErrorMessage('Error: That username is Taken');
                } else {
                    setError(false);
                    setErrorMessage('');
                    Cookies.set('username', username);
                    props.handleSuccessfulLogin()
                    props.history.push("/game-menu");
                }
            })
            .catch(error => {
                console.log("Error creating your user", error);
                setError(true);
                setErrorMessage('Error adding user, please try again')
            })
        }
    }

    useEffect(() => {
        setError(false);
        setErrorMessage('');
    }, [username, password, confirmPassword])

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h1 className="form-title">Sign Up</h1>
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
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    autoComplete="off"
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="form-button">Submit</button>
                </form>
                <h3 style={{visibility: error ? 'visible' : 'hidden'}}>{errorMessage}</h3>
            </div>
        </div>
    );
}