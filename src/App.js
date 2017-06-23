import React, { Component } from 'react';
import logo from './logo.svg';
import Canvas from './components/canvas.js';
import './App.css';
import table from './table.babylon.js';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }

        this.updateState = this.updateState.bind(this);
    };

    updateState() {
        this.setState({data: table});    }

    render() {
    return (
    <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Canvas data={this.state.data}/>
        <button id="mybutton" onClick={this.updateState}>Add Table</button>
    </div>
    );
    }
}

export default App;
