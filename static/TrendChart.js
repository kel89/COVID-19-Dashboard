/*
  ______                    __   ________               __
 /_  __/_______  ____  ____/ /  / ____/ /_  ____ ______/ /_
  / / / ___/ _ \/ __ \/ __  /  / /   / __ \/ __ `/ ___/ __/
 / / / /  /  __/ / / / /_/ /  / /___/ / / / /_/ / /  / /_
/_/ /_/   \___/_/ /_/\__,_/   \____/_/ /_/\__,_/_/   \__/
*/

var TrendChart = function(config){
	this.targetId = undefined;
	this.show = ["active"];
	this.margin = {'left': 40, 'top': 40, 'right': 20, 'bottom': 20};

	Object.keys(config).forEach(key => this[key] = config[key]);

	this.setupHTML();
	this.setupSVG();
	this.setupData();
	this.setupHelpers();
	this.plot();
}

TrendChart.prototype.setupHTML = function(){
	/*
	Adds html to the target this includes a title
	as well as buttons to decide which lines to show
	*/
	let html = `
	<div class='row' id='headerRow-${this.id}'>
		<div class='col-3'>
			<b>Trend</b>
		</div>
		<div class='col-3' align='center'>
			<button class='btn btn-outline-secondary active'
					id='activeButton-${this.id}'>
				Active Cases
			</button>
		</div>
		<div class='col-3' align='center'>
			<button class='btn btn-outline-secondary' id='deathButton-${this.id}'>
				Deaths
			</button>
		</div>
		<div class='col-3' align='center'>
			<button class='btn btn-outline-secondary' id='recoveryButton-${this.id}'>
				Recoveries
			</button>
		</div>
	</div>
	<div class='row'>
		<div class='col' id='chart-${this.id}'>

		</div>
	</div>
	`;

	$("#"+this.targetId).html(html);

	// handle the heights
	$("#chart-"+this.id).height( $("#"+this.targetId).height() -
			$("#headerRow-"+this.id).height());

	// Attach handlers to buttons
	$("#activeButton-"+this.id).click(() => this.handleButton("active"));
	$("#deathButton-"+this.id).click(() => this.handleButton("death"));
	$("#recoveryButton-"+this.id).click(() => this.handleButton("recovery"));
}

TrendChart.prototype.setupSVG = function(){
	/*
	Setsup SVG
	*/
	// get sizes
	let chart = $("#chart-"+this.id);
	this.width = chart.width();
	this.height = chart.height();
	this.chartWidth = this.width - this.margin.left - this.margin.right;
	this.chartHeight = this.height - this.margin.top - this.margin.bottom;

	this.svg = d3.select("#chart-"+this.id)
		.append('svg')
		.attr('width', this.width)
		.attr('height', this.height);

	this.g = this.svg.append('g')
		.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
}

TrendChart.prototype.setupData = function(){
	/*
	Sets up the data for plotting, takes a look to see which lines to show
	adds them to the plotting array
	*/
	// Initial setup
	this.plotData = [];
	let data;

	// Filter all the data
	confirmed_f = this.applyFilter(confirmedData)

	// Active cases
	if (this.show.indexOf('active') != -1){
		conf = this.applyFilter(confirmedData);
		death = this.applyFilter(deathData);
		reco = this.applyFilter(recoveryData);

		// do the subtractions
		data = {}
		dates.forEach(function(date){
			data[date] = conf[date] - death[date] - reco[date];
		});

		// format the data correctly
		this.plotData.push(this.formatData(data, "Active"));
	}

	// Deaths
	if (this.show.indexOf("death") != -1){
		// Get the death data
		death = this.applyFilter(deathData);
		this.plotData.push(this.formatData(death, "Deaths"));
	}

	// Recovery
	if (this.show.indexOf("recovery") != -1){
		reco = this.applyFilter(recoveryData);
		this.plotData.push(this.formatData(reco, "Recoveries"));
	}

}

TrendChart.prototype.applyFilter = function(data){
	/*
	Applys the country and state filter
	*/
	data = deepCopy(data);
	if (masterCountry != undefined){
		data = data.filter(x => x["Country/Region"] == masterCountry);
	}
	if (masterState != undefined){
		data = data.filter(x => x["Province/State"] == masterState);
	}

	// If both are undefined we need to sum it all

	if ( (masterCountry == undefined) & (masterState == undefined) ){
		let newData = {};
		dates.forEach(function(date){
			let s = 0;
			data.forEach(d => s += d[date]);
			newData[date] = s;
		});
		return newData;
	}
	else{
		return data;
	}
}

TrendChart.prototype.formatData = function(data, name){
	/*
	Takes in a dictionary of data and transforms it into
	an array, takes in optional name
	*/
	let newData = [];
	dates.forEach(function(date){
		newData.push({
			x: date,
			y : data[date],
			which : name
		});
	});
	return newData;
}

TrendChart.prototype.setupHelpers = function(){
	/*
	Setsup the scales, the axes
	*/
	this.xScale = d3.scaleTime()
			.domain(d3.extent(dates.map(x => new Date(x))))
			.range([0, this.chartWidth]);
	console.log(this.xScale.range());

	this.yScale = d3.scaleLinear()
			.domain([0, this.getMaxY()])
			.range([this.chartHeight, 0]);
	console.log(this.yScale.range());

	this.line = d3.line()
		.x(d => this.xScale(new Date(d.x)))
		.y(d => this.yScale(d.y))
		.curve(d3.curveMonotoneX);

	// makes the axes
	this.xAxis = d3.axisBottom(this.xScale);
	this.yAxis = d3.axisLeft(this.yScale);

	// Make the g's
	this.xAxisG = this.g.append('g')
		.attr('transform', `translate(0, ${this.chartHeight})`)
		.attr('class', 'axis')
		.call(this.xAxis);

	this.yAxisG = this.g.append('g')
		.attr('transform', `translate(0, 0)`)
		.call(this.yAxis);

}

TrendChart.prototype.getMaxY = function(){
	/*
	Looks at plot data to get the max val
	*/
	let ys = [];
	this.plotData.forEach(dat => {ys = ys.concat(dat.map(x => x.y))});
	return d3.max(ys);
}

TrendChart.prototype.plot = function(){
	/*
	Makes the plot, this is also the function
	that should be called when the data changes, as
	it should re-plot everything
	*/
	let _this = this;
	let lineSet = this.g.selectAll(".line")
				.data(this.plotData, d => d[0].which);

	// New lines
	// console.log(this.line(this.plotData[0])));
	// console.log(this.line(this.plotData[0]));
	lineSet.enter()
		.append('path')
		// .attr('d', d => this.line(d))
		.attr('d', function(d){
			// console.log(d);
			return _this.line(d);
		})
		.attr('class', 'line')
		.attr('stroke', 'red')
		.attr('fill', 'none')
		.attr('stroke-width', '2px')

	// Update line

	// Remove line

	// Plot the points ------------
	
}

TrendChart.prototype.handleButton = function(which){
	/*
	Takes in the name of the button that was clicked,
	determines if it is active or not, adds or removes
	the class to indicate it, updates the list determine which
	series to plot, the calls the update function for the plot
	*/
	let button;
	if (which == "active"){
		button = $("#activeButton-"+this.id)
	}
	if (which == "death"){
		button = $("#deathButton-"+this.id)
	}
	if (which == "recovery"){
		button = $("#recoveryButton-"+this.id)
	}
	console.log(this.show);
	if (button.hasClass('active')){
		// it is showing, so take it out of the list
		button.removeClass('active');
		this.show = this.show.filter(x => x != 'active');

	}
	else{
		// not active, so make it so
		button.addClass('active');
		this.show.push(which);
	}

	console.log(this.showing);

}
