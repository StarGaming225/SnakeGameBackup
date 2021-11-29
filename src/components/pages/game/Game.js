import React, { Component, useState, useEffect } from 'react';
import Snake from './Snake';
import Food from './Food';

import './index.css';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const initialState = {
    food: getRandomCoordinates(),
    speed: 100,
    direction: 'RIGHT',
    snakeDots: [
      [2,50],
      [0,50]
    ]
  }


class Game extends Component {
  page = "game"
  previousLength = 0;
  state = initialState;
  highestLength = "";
  timesPlayed = "";
  widthChecked = false;
  
  getTimesPlayed() {
    fetch(`https://esnakeapi.herokuapp.com/user/get/username/${Cookies.get("username")}`, {
      method: "GET"
    })
    .then(res => res.json())
    .then(data => {
      this.timesPlayed = data[0]
    })
  }

  getHighestLength() {
    fetch(`https://esnakeapi.herokuapp.com/user/get/username/${Cookies.get("username")}`, {
      method: "GET"
    })
    .then(res => res.json())
    .then(data => {
      this.highestLength = data[1]
    })
  }

  setHighestLength() {
    const longest_length = this.state.snakeDots.length

    fetch(`https://esnakeapi.herokuapp.com/user/update/${Cookies.get("username")}`, {
        method: "PUT",
        headers: {"content-type" : "application/json"},
        body: JSON.stringify({
            longest_length
        })
    })
  }

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    this.getHighestLength();
    this.getTimesPlayed();
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.getHighestLength();
    this.getTimesPlayed();
    this.checkWidth()
  }

  onKeyDown = (e) => {
    e = e || window.event;
    if (e.keyCode === 38 && this.state.direction !== 'DOWN' || e.keyCode === 87 && this.state.direction !== 'DOWN') {
      this.setState({direction: 'UP'});
    }
    if (e.keyCode === 40 && this.state.direction !== 'UP' || e.keyCode === 83 && this.state.direction !== 'UP') {
      this.setState({direction: 'DOWN'});
    }
    if (e.keyCode === 39 && this.state.direction !== 'LEFT' || e.keyCode === 68 && this.state.direction !== 'LEFT') {
      this.setState({direction: 'RIGHT'});
    }
    if (e.keyCode === 37 && this.state.direction !== 'RIGHT' || e.keyCode === 65 && this.state.direction !== 'RIGHT') {
      this.setState({direction: 'LEFT'});
    }
  }

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates()
      })
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 30
      })
    }
  }

  onGameOver() {
    this.setHighestLength()
    this.setState(initialState)
  }

  checkWidth() {
    if (window.innerWidth > 615) {
      this.widthChecked = false
    } else {
      this.widthChecked = true
    }
  }

  mobileMove(direction) {
    if (direction === "UP" && this.state.direction !== 'DOWN') {
      this.setState({direction: 'UP'});
    }
    if (direction === "DOWN" && this.state.direction !== 'UP') {
      this.setState({direction: 'DOWN'});
    }
    if (direction === "LEFT" && this.state.direction !== 'RIGHT') {
      this.setState({direction: 'LEFT'});
    }
    if (direction === "RIGHT" && this.state.direction !== 'LEFT') {
      this.setState({direction: 'RIGHT'});
    }
  }

  render() {
    return (
        <div className="game">
            <div className="game-area">
                <Snake snakeDots={this.state.snakeDots}/>
                <Food dot={this.state.food}/>
            </div>
              {this.widthChecked ?
              (
                <div className="mobile-buttons">
                  <div className="up">
                    <FontAwesomeIcon onClick={() => this.mobileMove("UP")} icon="arrow-up" />
                  </div>
                  <div className="mid-btns">
                    <div className="left">
                      <FontAwesomeIcon onClick={() => this.mobileMove("LEFT")} icon="arrow-left" />
                    </div>
                    <div className="right">
                      <FontAwesomeIcon onClick={() => this.mobileMove("RIGHT")} icon="arrow-right" />
                    </div>
                  </div>
                  <div className="down">
                    <FontAwesomeIcon onClick={() => this.mobileMove("DOWN")} icon="arrow-down" />
                  </div>
                </div>
                ) : 
              null}
            <div className="game-info">
              <button onClick={() => this.setState(initialState)}>Replay</button>
              <div className="info">
                <div>
                  {"Current Length: "}
                </div>
                <div className="data-point">
                  {this.state.snakeDots.length}
                </div>
              </div>
              <div className="info">
                <div>
                  {"Highest Length: "}
                </div>
                <div className="data-point">
                  {this.highestLength}
                </div>
              </div>
              <div className="info">
                <div>
                  {"Times Played: "}
                </div>
                <div className="data-point">
                  {this.timesPlayed}
                </div>
              </div>
            </div>
        </div>
    );
  }
}

export default Game;