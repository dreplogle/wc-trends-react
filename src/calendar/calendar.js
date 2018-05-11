import GuildForm from '~/forms/forms.js';
import BarGraph from '~graphs/graphs.js';
import {api_call} from '~/api/api.js';

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};
// ToDo: trim down state
export class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: false,
			date: [], 
			chosen_dates: [],
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
				return <Calendar key={date.id} value={date} onChange={this.handleDate}/>
			}
			else return null;
		})
		const graph = (this.state.search) ? <BarGraph xaxis={this.state.xaxis} yaxis={this.state.yaxis}></BarGraph> : null;
		return (
			<section id="calendar">
				<GuildForm onSubmit={this.handleSubmit} />
				<ul className="dates">{dates}</ul>
				{graph}
			</section>
		)
	}
	handleSubmit(res) {
		this.setState({date: res});
	}

	handleDate(active, id) {
		// Logic for if the date was selected; else should contain for if date was not selected
		if(active) {
			const chosen = this.state.chosen_dates.slice();
			chosen.push(id);
			let fights = this.state.fight_data;
			let num_fights = {};
			if(!fights.hasOwnProperty(id)) {
				api_call("fights/" + id, res => {
					fights[id] = res;	
					// console.log(fights);
					// const xaxis = this.state.xaxis;
					// const yaxis = this.state.yaxis;
					// var bosses = ['Garothi', 'Hounds', 'Triad', 'Eonar', 'Portal Keeper', 'Imonar', "Kin'goroth", 'Varimathras', 'Coven', 'Aggramar', 'Argus']

					
					// For each raid in the hash
					Object.keys(fights).forEach(function (key) { 
						let raid = fights[key].fights;
						// For each fight in the raid
						Object.keys(raid).forEach(function(fight){
							var boss_name = raid[fight].name;
							var boss_id = raid[fight].boss;
							// If boss fight occurred, tally into total number of fights
							if(boss_id !== 0) {
								// console.log(num_fights);
								num_fights[boss_name] = (num_fights[boss_name] || 0) + 1;
							}
						})
					})
					let xaxis = [];
					let yaxis = [];
					Object.keys(num_fights).forEach(function(key) {
						yaxis.push(key);
						xaxis.push(num_fights[key]);
					});
					this.setState({fight_data: fights, chosen_dates: chosen, xaxis: xaxis, yaxis: yaxis, search: true});
				})
			}
		}
		else {
			const chosen = this.state.chosen_dates.slice();
			const new_chosen = chosen.filter(e => e !== id)
			this.setState({
				chosen_dates: new_chosen,
			});
		}
	}
}

class Date extends Component {
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