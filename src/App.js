// npm start
import React, { Component } from 'react';
import Chart from 'chart.js';
import logo from './logo.svg';
import './App.css';
import Calendar from './components/calendar.js';

class App extends Component {
	render() 
	{
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p> 
				<Calendar />
				{/* <div id="graph"><Graph data={this.state.data}/></div> */}
			</div>
		);
	}
}

export default App;