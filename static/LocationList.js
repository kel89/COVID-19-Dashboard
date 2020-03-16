/*
    __    _      __
   / /   (_)____/ /_
  / /   / / ___/ __/
 / /___/ (__  ) /_
/_____/_/____/\__/
*/

var LocationList = function(config){
	this.targetId = undefined;

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
	let html = `
	<div id='container-${this.id}' class='scrollable' style='height:100%; overflow-y:auto;'>
		<table class='locationTable' id='table-${this.id}'>
			<tr>
				<th>Location</th>
				<th>Active Cases</th>
				<th>Deaths</th>
				<th>Recoveries</th>
			</tr>
		</table>
	</div>
	`;

	let targetHeight = $("#"+this.targetId).height();
	console.log($("#container-"+this.id));
	$("#"+this.targetId).html(html);
	$("#container-"+this.id).height(targetHeight);

}

LocationList.prototype.setupData = function(){
	/*
	Sends a request to the server for the data?
	*/
	let _this = this;
	// Get all locations from confirmedData
	let locations = confirmedData.map(function(d){
		return {
			'Country' : d['Country/Region'],
			'State': d['Province/State']
		}
	});

	// Get data for countries
	let countries = d3.set(locations.map(x => x.Country)).values();
	let tableData = [];
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
	});

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
	// sort the data
	this.tableData.sort((a, b) => b['Active Cases'] - a['Active Cases']);
	let html = '';
	this.tableData.forEach(function(d){
		html += `
			<tr>
				<td>${d.Location.toLocaleString()}</td>
				<td>${d['Active Cases'].toLocaleString()}</td>
				<td>${d.Deaths.toLocaleString()}</td>
				<td>${d.Recoveries.toLocaleString()}</td>
			</tr>
		`;
	});

	$(`#table-${this.id}`).append(html);
}

LocationList.prototype.resize = function(){
	this.setupHTML();
	this.setupData();
	this.makeTable();
}
