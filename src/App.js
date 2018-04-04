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
				{/* <div id="graph"><Graph data={this.state.data}/></div> */}
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
			chosenDates: [],
			fight_data: {},
			xaxis: [],
			yaxis: [],
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDate = this.handleDate.bind(this);
	}
	render() {
		const dates = this.state.date.map((date) => {
			// Only if Antorus; later will add a select feature so the raid of choice can be filtered 
			if(date.zone === 17) {
				return <CalendarDate key={date.id} value={date} onChange={this.handleDate}/>
			}
		})
		const graph = this.state.fight_data ? <BarGraph xaxis={this.state.xaxis} yaxis={this.state.yaxis}/> : null;

		return (
			<section id="calendar">
				<GuildForm onSubmit={this.handleSubmit} />
				<ul className="dates">{dates}</ul>
				<div className="graph">{graph}</div>
			</section>
		)
	}
	handleSubmit(res) {
		this.setState({date: res});
	}
	handleDate(active, id) {
		if(active) {
			const chosen = this.state.chosenDates.slice();
			chosen.push(id);
			this.setState({
				chosenDates: chosen,
			});
			let fights = this.state.fight_data;
			if(!fights.hasOwnProperty(id)) {
				api_call("fights/" + id, res => {
					fights[id] = res;
					const xaxis = this.state.xaxis;
					const yaxis = this.state.yaxis;
					var bosses = ['Garothi', 'Hounds', 'Triad', 'Eonar', 'Portal Keeper', 'Imonar', "Kin'goroth", 'Varimathras', 'Coven', 'Aggramar', 'Argus']
					// For each fight in the hash
					Object.keys(fights).forEach(function (key) { 
						let raid = fights[key].fights;
						// For each fight in the raid
						Object.keys(raid).forEach(function(fight){
							console.log(raid[fight]);
						})
					})
				})
			}
			
			this.setState({fight_data: fights});
			
		}
		else {
			const chosen = this.state.chosenDates.slice();
			const new_chosen = chosen.filter(e => e !== id)
			this.setState({
				chosenDates: new_chosen,
			});
		}
	}
}
class BarGraph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chart: {},
		}
	}
	componentDidMount() {
		
		let newChart = this.createGraph();
		this.setState({chart: newChart});	 
	}
	createGraph(data) {
		const canvas = document.getElementById("chart");
		var newChart = new Chart(canvas, {
			type: 'bar',
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
	// componentDidUpdate () {
	// 	let chart = this.state.chart;
	// 	let data = this.props.data;
	
	// 	data.datasets.forEach((dataset, i) => chart.data.datasets[i].data = dataset.data);
	
	// 	chart.data.labels = data.labels;
	// 	chart.update();
	// }

	
	render() {
		return <canvas id="chart" refs="chart"></canvas>
	}
}

class CalendarDate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
		};
		this.toggleActive = this.toggleActive.bind(this);
	}

	toggleActive() {
		const currentState = this.state.active;
		this.setState({active: !currentState});
		this.props.onChange(!currentState, this.props.value.id);
	}

	render() {
		const time = timeConverter(this.props.value.start);
		return (
			<li className={this.state.active ? 'active' : ''} onClick={this.toggleActive}>
				<div className="raid_name">{this.props.value.title}</div>
				<div className="raid_owner">{this.props.value.owner}</div>
				<div className="raid_time">{time}</div> 
			</li>
		)
	}
}
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
	return time;
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
	constructor(props) {
		super(props);
		this.state = {
			chart: {},
		}
	}
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

	
	render() {
		return <canvas id="chart" refs="chart"></canvas>
	}

}

export default App;