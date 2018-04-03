// npm start
import React, { Component } from 'react';
import Chart from 'chart.js';
import logo from './logo.svg';
import './App.css';
import {api_call} from './api/api.js';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {
				labels: ['0', '1'],
				datasets: [
				{
					data: ['0', '1'],
					borderColor: "#3cba9f",
					fill: false
				},
				]
			},
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
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
				<Graph data={this.state.data}/>
			</div>
		);
	}

	handleSubmit(rank, xaxis) {
		// Update graph
		var data = Object.assign({}, this.state.data);
		data.labels = xaxis;
		data.datasets[0].data = rank;
		this.setState({data});
	}
}

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: [], 
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		const dates = this.state.date.map((date) => <Date key={date.id} value={date} />)
		return (
			<div className="calendar">
				<GuildForm onSubmit={this.handleSubmit} />
				<ul className="dates">{dates}</ul>
			</div>
		)
	}
	handleSubmit(res) {
		this.setState({date: res});
	}
}

class Date extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
	}

	render() {
		return (
			<li>{this.props.value.title}</li>
		)
	}
}

class UserForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: 'meowtapes',
			realm: 'proudmoore',
			region: 'us'
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.value;
		this.setState({
			[name]: value
		});
	}
	
	handleSubmit(event) {
		api_call(this.state.username + "/" + this.state.realm + "/" + this.state.region, (res) => {
			let rank = [];
			let xaxis = [];
			let x = 1;
			let key = "";
			for(key in res) {
				if(res[key].difficulty === 4) {
					let num = "";
					for(num in res[key]['specs']['0']['data']) {
						rank.push(res[key]['specs']['0']['data'][num].percent);
						xaxis.push(x);
					}
					x++;
				}
			}
			this.props.onSubmit(rank, xaxis);
		})
		event.preventDefault();
	}
	render () {
		return ( 
			<form onSubmit={this.handleSubmit}>
				<label>Username
					<input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
				</label>
				<label>Realm
					<input type="text" name="realm" value={this.state.realm} onChange={this.handleChange} />
				</label>
				<label>Region
					<input type="text" name="region" value={this.state.region} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		)
	}
}

class GuildForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			guild: 'smol pupper',
			realm: 'proudmoore',
			region: 'us'
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.value;
		this.setState({
			[name]: value
		});
	}
	
	handleSubmit(event) {
		api_call("guild/" + this.state.guild + "/" + this.state.realm + "/" + this.state.region, (res) => {
			this.props.onSubmit(res);
		})
		event.preventDefault();
	}
	render () {
		return ( 
			<form onSubmit={this.handleSubmit}>
				<label>Guild Name
					<input type="text" name="guild" value={this.state.guild} onChange={this.handleChange} />
				</label>
				<label>Realm
					<input type="text" name="realm" value={this.state.realm} onChange={this.handleChange} />
				</label>
				<label>Region
					<input type="text" name="region" value={this.state.region} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		)
	}
}

class Graph extends Component {
	componentDidMount() {
		let newChart = this.createGraph(this.props.data);
		this.setState({chart: newChart});	 
	}
	createGraph(data) {
		const canvas = document.getElementById("chart");
		var newChart = new Chart(canvas, {
			type: 'line',
			data: data,
			options: {
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: true,
					}],
					yAxes: [{
						display: true,
						ticks: {
							min: 0,
							max: 100
						}
					}],
				}
			}
		});
		return newChart;
	}
	componentDidUpdate () {
		let chart = this.state.chart;
		let data = this.props.data;
	
		data.datasets.forEach((dataset, i) => chart.data.datasets[i].data = dataset.data);
	
		chart.data.labels = data.labels;
		chart.update();
	}
	constructor(props) {
		super(props);
		this.state = {
			chart: {},
		}
	}
	
	render() {
		return <canvas id="chart" refs="chart"></canvas>
	}

}

export default App;