import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import Cookies from 'js-cookie';

const NavBar = (props) => {

    const handleSignOut = () => {
        Cookies.remove("username");
        props.handleSuccessfulLogout();
        props.history.push("/");
    };

    const handleDeleteAccount = () => {
        props.handleSuccessfulAccountDeletion();
        Cookies.remove("username");
        props.history.push("/");
    }


    const loggedInPages = () => {
        return [
            <div key="1" className="login-navbar">
                <div className="left-side">
                    <div className="nav-link-wrapper">
                        <NavLink exact to="/game-menu" activeClassName="nav-link-active">Menu</NavLink>
                    </div>
                    <div className="nav-link-wrapper">
                        <NavLink exact to="/snake-game" activeClassName="nav-link-active">Play</NavLink>
                    </div>
                    <div className="nav-link-wrapper">
                        <a onClick={handleSignOut}>
                            Sign Out
                        </a>
                    </div>
                </div>
                <div className="right-side">
                    <div className="nav-link-wrapper">
                        <a className="delete" onClick={handleDeleteAccount}>
                            Delete Account
                        </a>
                    </div>
                </div>
            </div>
        ]
    }

    const loggedOutPages = () => {
        return [
            <div key="3" className="nav-link-wrapper">
                <NavLink exact to="/">Login</NavLink>
            </div>,
            <div key="4" className="nav-link-wrapper">
                <NavLink exact to="/sign-up" activeClassName="nav-link-active">Sign Up</NavLink>
            </div>
        ]
    }

    return (
    <div className="nav-wrapper">
        {props.loggedInStatus === "NOT_LOGGED_IN" ? (loggedOutPages()) : null}

        {props.loggedInStatus === "LOGGED_IN" ? (loggedInPages()) : null}
    </div>
    );
}

export default withRouter(NavBar);