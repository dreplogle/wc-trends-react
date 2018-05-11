export class BarGraph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chart: {},
		}
	}
	componentDidMount() {
		let newChart = this.createGraph(this.props.xaxis, this.props.yaxis);
		this.setState({chart: newChart});	 
	}
	createGraph(xaxis, yaxis) {
		const canvas = document.getElementById("chart");
		var color = Chart.helpers.color;
		var newChart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: yaxis,
				datasets: [{
					label: 'Number of Fights',
					backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
					borderColor: window.chartColors.blue,
					borderWidth: 1,
					data: xaxis,
				}]
			}, 
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
							max: 40,
							padding: 5,
						}
					}],
				}
			}
		});
		return newChart;
	}
	componentDidUpdate () {
		let chart = this.state.chart;
		// // data.datasets.forEach((dataset, i) => chart.data.datasets[i].data = dataset.data);
		chart.data.datasets[0].data = this.props.xaxis;
		chart.data.labels = this.props.yaxis;
		chart.update();
	}
	render() {
		return <canvas id="chart" refs="chart"></canvas>
	}
}


export class Graph extends Component {
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