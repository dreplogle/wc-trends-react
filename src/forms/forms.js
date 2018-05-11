export class UserForm extends Component {
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

export class GuildForm extends Component {
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
