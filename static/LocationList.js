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
	<!--
	<col width='25%'>
	<col width='25'>
	<col width='25%'>
	<col width='25%'>
	-->
	<tr>
		<th>Location</th>
		<th>Confirmed</th>
		<th>Deaths</th>
	</tr>
	`;

	let html = `
	<div id='header-${this.id}'>
		<button id='back-${this.id}' class='btn btn-outline-secondary'
			style='width:100%; display:None;'>
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
	// console.log($("#back-"+this.id));
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

	// determine what the location key is
	let key;
	if (masterCountry == undefined & masterState == undefined){
		key = "Country/Region"
	}
	else if (masterState == undefined){
		key = "Province/State"
	}
	else{
		key = "Admin2"
	}

	// Map the data
	this.tableData = masterLocationData.map(function(d){
		return {
			location: d[key],
			confirmed: d.Confirmed,
			deaths: d.Deaths
		}
	});

	// Sort it
	this.tableData = this.tableData.sort((a,b) => b.confirmed - a.confirmed);

}


LocationList.prototype.makeTable = function(){
	/*
	Makes the table in the HTML
	*/
	let _this = this;
	// sort the data
	let html = '';
	this.tableData.forEach(function(d){
		html += `
			<tr>
				<td><b>${d.location}</b></td>
				<td>${d.confirmed == null ? 0 : d.confirmed.toLocaleString()}</td>
				<td>${d.deaths == null ? 0 : d.deaths.toLocaleString()}</td>
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

	// Determine what is showing
	if (masterCountry == undefined & masterState == undefined){
		// Looking at countries
		masterCountry = where
	}
	else if (masterState == undefined){
		// Looking at states
		return;
		masterState = where

	}
	else{
		// Looking at Admin2 (County)
		return; // do nothing
	}

	// Show the back button
	$("#back-"+this.id).show();

	updateData();
}

LocationList.prototype.back = function(){
	/*
	Called when back button pressed to go back a level
	*/
	console.log("IN BACK");
	masterCountry = undefined;
	masterState = undefined;
	$("#back-"+this.id).hide();
	updateData();

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
