import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "../style/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import NavBar from './navigation/navbar';
import Game from "./pages/game/Game";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import SnakeGameMenu from "./pages/snake-game-menu";
import NoMatch from "./pages/no-match";
import Cookies from 'js-cookie';

library.add(faArrowUp, faArrowDown, faArrowLeft, faArrowRight);

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN"
    }

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this)
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this)
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this)
    this.handleSuccessfulAccountDeletion = this.handleSuccessfulAccountDeletion.bind(this)
  }

  checkCookes() {
    if (Cookies.get("username")) {
      this.setState({
        loggedInStatus: "LOGGED_IN"
      })
    } else {
      this.setState({
        loggedInStatus: "NOT_LOGGED_IN"
      })
    }
  }

  handleSuccessfulAccountDeletion() {
    fetch(`https://esnakeapi.herokuapp.com/user/delete/${Cookies.get("username")}`, {
        method: "DELETE"
    })
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN"
    })
  }
  
  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }
  
  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  loggedInPages() {
    return [
      <Route
      key = "1"
      exact
      path="/game-menu"
      render={props => (
        <SnakeGameMenu {...props} loggedInStatus={this.state.loggedInStatus}/>
      )}
      />,
      <Route 
      key = "2"
      exact 
      path="/snake-game"
      render={props => (
        <Game {...props} loggedInStatus={this.state.loggedInStatus}/>
      )}
      />
    ]
  }

  loggedOutPages() {
    return [
      <Route 
        key = "1"
        exact
        path="/" 
        render={props => (
          <Login
            {...props}
            handleSuccessfulLogin={this.handleSuccessfulLogin}
            handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
          />
        )
      }
      />,
      <Route 
        key = "2"
        exact
        path="/sign-up" 
        render={props => (
          <SignUp
            {...props}
            handleSuccessfulLogin={this.handleSuccessfulLogin}
            handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
          />
        )
      }
      />
    ]
  }

  componentDidMount() {
    this.checkCookes()
  }
  
  render() {
      return (
        <div className='app'>
          <Router>
          <div>
            <NavBar 
            loggedInStatus={this.state.loggedInStatus} 
            handleSuccessfulLogout={this.handleSuccessfulLogout}
            handleSuccessfulAccountDeletion={this.handleSuccessfulAccountDeletion}
            />
            <Switch>
              {this.state.loggedInStatus === "NOT_LOGGED_IN" ? (this.loggedOutPages()) : null}

              {this.state.loggedInStatus === "LOGGED_IN" ? (this.loggedInPages()) : null}

              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
        </div>
      );
  }
}