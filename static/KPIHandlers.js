/*
    __ __ ____  ____   __  __                ____
   / //_// __ \/  _/  / / / /___ _____  ____/ / /__  __________
  / ,<  / /_/ // /   / /_/ / __ `/ __ \/ __  / / _ \/ ___/ ___/
 / /| |/ ____// /   / __  / /_/ / / / / /_/ / /  __/ /  (__  )
/_/ |_/_/   /___/  /_/ /_/\__,_/_/ /_/\__,_/_/\___/_/  /____/
*/

var totalCasesKPI = function(config){
	this.targetId = undefined;

	Object.keys(config).forEach(key => this[key] = config[key]);
	this.id = generateId();

	this.getData();
}

totalCasesKPI.prototype.getData = function(){
	/*
	Sends a call to the server to get the case count
	*/
	let _this = this;
	$.ajax({
		type: "POST",
		url: "get_active_cases",
		context: document.body,
		success: function(data){
			data = JSON.parse(data.data);
			_this.data = data;
			_this.show();
		}
	});
}

totalCasesKPI.prototype.show = function(){
	/*
	Updates/shows the HTML on target
	Processes the raw data (summing it)
	*/
	// Process the data (get the last entry)
	let last = this.data[this.data.length -1];
	let count = last.count

	// Show in the HTML
	$("#" + this.targetId).html(`
		Total Active Cases: <span style='float:right; color:var(--main-red)'>
			<b>${count.toLocaleString()}</b>
		</span>
	`);
}



/*------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
------------------------------------------------------------------------------*/


var totalDeathsKPI = function(config){
	this.targetId = undefined;

	Object.keys(config).forEach(key => this[key] = config[key]);
	this.id = generateId();

	this.getData();
}

totalDeathsKPI.prototype.getData = function(){
	/*
	Sends a call to the server to get the case count
	*/
	let _this = this;
	$.ajax({
		type: "POST",
		url: "get_deaths",
		context: document.body,
		success: function(data){
			data = JSON.parse(data.data);
			_this.data = data;
			_this.show();
		}
	});
}

totalDeathsKPI.prototype.show = function(){
	/*
	Updates/shows the HTML on target
	Processes the raw data (summing it)
	*/
	// Process the data (get the last entry)
	let last = this.data[this.data.length -1];
	let count = last.count

	// Show in the HTML
	$("#" + this.targetId).html(`
		Total Deaths: <span style='float:right; color:white;'>
			<b>${count.toLocaleString()}</b>
		</span>
	`);
}

/*------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
------------------------------------------------------------------------------*/


var recoveredKPI = function(config){
	this.targetId = undefined;

	Object.keys(config).forEach(key => this[key] = config[key]);
	this.id = generateId();

	this.getData();
}

recoveredKPI.prototype.getData = function(){
	/*
	Sends a call to the server to get the case count
	*/
	let _this = this;
	$.ajax({
		type: "POST",
		url: "/get_recovered",
		context: document.body,
		success: function(data){
			data = JSON.parse(data.data);
			_this.data = data;
			_this.show();
		}
	});
}

recoveredKPI.prototype.show = function(){
	/*
	Updates/shows the HTML on target
	Processes the raw data (summing it)
	*/
	// Process the data (get the last entry)
	let last = this.data[this.data.length -1];
	let count = last.count

	// Show in the HTML
	$("#" + this.targetId).html(`
		Total Recovered: <span style='float:right; color:var(--main-green);'>
			<b>${count.toLocaleString()}</b>
		</span>
	`);
}
