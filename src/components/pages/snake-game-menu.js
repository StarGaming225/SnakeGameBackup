import React, { Component } from 'react';

export default class SnakeGameMenu extends Component {
    render() {
        return (
            <div className="menu">
                <div className="menu-title">
                    SNAKE
                </div>
                <div className="menu-description">
                    You are a Snake. You are trapped in a box and you have found yourself to be very hungry. For some reason you keep finding apples appearing in the box. Sometimes the apples will even appear under your own tail and you wont know its there until you go looking. Even though you start off small, by moving around (Arrow Keys/WASD) and collecting the fruit, you can grow much bigger. Now that you have collected your thoughts, you start your journey. Press Play!
                </div>
            </div>
        );
    }
}