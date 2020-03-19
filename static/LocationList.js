/*
    __    _      __
   / /   (_)____/ /_
  / /   / / ___/ __/
 / /___/ (__  ) /_
/_____/_/____/\__/
*/

var LocationList = function(config){
	this.targetId = undefined;
	this.showing = "Country"; //alternative is State

	Object.keys(config).forEach(key => this[key] = config[key]);
	this.id = generateId();

	this.setupHTML();
	this.setupData();
	this.makeTable();
}

LocationList.prototype.setupHTML = function(){
	/*
	Setsup the html for the table, as well as the
	header (maybe layer we will add a dropdown
	to select a date)
	*/
	this.tableHeaderHTML = `
	<col width='30%'>
	<col width='23'>
	<col width='23%'>
	<col width='23%'>
	<tr>
		<th>Location</th>
		<th>Active Cases</th>
		<th>Deaths</th>
		<th>Recoveries</th>
	</tr>
	`;

	let html = `
	<div id='header-${this.id}'>
		<button id='back-${this.id}' class='btn btn-outline-secondary'
			style='width:100%;display:none;'>
			Back
		</button>
	</div>
	<div id='container-${this.id}' class='scrollable' style='height:100%; overflow-y:auto;'>
		<table class='locationTable' id='table-${this.id}'>
			${this.tableHeaderHTML}
		</table>
	</div>
	`;

	let targetHeight = $("#"+this.targetId).height();
	$("#"+this.targetId).html(html);
	$("#container-"+this.id).height(targetHeight);

	// Attach event handler to back button
	console.log($("#back-"+this.id));
	$("#back-"+this.id).click(() => this.back());

}

LocationList.prototype.setupData = function(){
	/*
	Sends a request to the server for the data?
	THere are three cases,
		- we have nothing selected
		- we have a country selected

	*/
	let _this = this;

	let currentDate = dates[dates.length -1];
	let locations = confirmedData.map(function(d){
		return {
			'Country' : d['Country/Region'],
			'State': d['Province/State']
		}
	});
	// locations = d3.set(locations).values();
	// console.log(locations);
	let tableData = [];

	// check to see if we need to pass over to the countries based on
	// the lack of states
	let pass = true;
	if (masterCountry != undefined){
		// check to see if there are states?
		if (locations.filter(x => x.Country == masterCountry).map(x => x.State).length == 1){
			pass = false;
			// hide the back button
			$("#back-"+this.id).hide();
		}
	}

	// If state is defined, filter on that
	if (masterCountry != undefined & pass){
		// get the states
		console.log(locations.filter(x => x.Country == masterCountry));

		let states = locations.filter(x => x.Country == masterCountry).map(x => x.State);
		states.forEach(function(state){
			conf = confirmedData.filter(x => x['Province/State'] == state)[0][currentDate];
			death = deathData.filter(x => x['Province/State'] == state)[0][currentDate];
			reco = recoveryData.filter(x => x['Province/State'] == state)[0][currentDate];

			// .filter(x => (x["Country/Region" == masterCountry])
			// 		& (x['Province/State'] == state))[0][currentDate];

			// make data object
			tableData.push({
				Location: state,
				'Active Cases' : (conf - death - reco),
				'Deaths': death,
				'Recoveries' : reco
			});
		})


	}
	else{
		console.log("undefined country, showing all");
		let countries = d3.set(locations.map(x => x.Country)).values();
		// console.log(countries);
		countries.forEach(function(country){
			// get confirmed cases
			let confirmedCount = _this.getCount(confirmedData, country);

			// get deaths
			let deathCount = _this.getCount(deathData, country);

			// get recovered
			let recoveredCount = _this.getCount(recoveryData, country);

			// make data object
			tableData.push({
				Location: country,
				'Active Cases' : (confirmedCount - deathCount - recoveredCount),
				'Deaths': deathCount,
				'Recoveries' : recoveredCount
			});
		})
	}

	this.tableData = tableData;

}

LocationList.prototype.getCount = function(data, country, state){
	/*
	Takes in a thing of data, and returns
	the count for a given location, if state is not undefined
	will focus on that instead
	*/
	let key = state == undefined ? "Country/Region" : "Province/State";
	let toMatch = state==undefined ? country : state;

	let currentDate = dates[dates.length -1];

	let filtered = data.filter(x => x[key] == toMatch);
	let count = filtered.reduce((acc, cur) => acc + cur[currentDate], 0);
	return count;

}

LocationList.prototype.makeTable = function(){
	/*
	Makes the table in the HTML
	*/
	let _this = this;
	// sort the data
	this.tableData.sort((a, b) => b['Active Cases'] - a['Active Cases']);
	let html = '';
	this.tableData.forEach(function(d){
		html += `
			<tr>
				<td><b>${d.Location.toLocaleString()}</b></td>
				<td>${d['Active Cases'].toLocaleString()}</td>
				<td>${d.Deaths.toLocaleString()}</td>
				<td>${d.Recoveries.toLocaleString()}</td>
			</tr>
		`;
	});

	$(`#table-${this.id}`).html(this.tableHeaderHTML + html);

	// attach event handler to each row
	$("tr").click(function(){
		_this.rowClick(this);
	});
}

LocationList.prototype.rowClick = function(row){
	// Get the location
	let where = $($(row).children()[0]).text();
	if (where == "Location"){
		return;
	}

	if (this.showing == "Country"){
		// switch to state
		masterCountry = where;
		$("#back-"+this.id).show();

	}
	else{
		// Switch to country level
		masterCountry = undefined;
		masterState = undefined;

	}

	masterUpdate();
}

LocationList.prototype.back = function(){
	/*
	Called when back button pressed to go back a level
	*/
	console.log("IN BACK");
	masterCountry = undefined;
	masterState = undefined;
	$("#back-"+this.id).hide();
	masterUpdate();

}

LocationList.prototype.resize = function(){
	this.setupHTML();
	this.setupData();
	this.makeTable();
}

LocationList.prototype.update = function(){
	this.setupData();
	this.makeTable();
}
