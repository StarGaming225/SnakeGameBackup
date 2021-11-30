import React from 'react';
import { Link } from 'react-router-dom';

export default function(props) {
  const checkLogin = () => {
    if (props.loggedInStatus === "NOT_LOGGED_IN") {
      props.history.push("/");
    } else {
      props.history.push("/game-menu");
    }
  }

    return (
        <div>
          {checkLogin()}
        </div>
    );
}