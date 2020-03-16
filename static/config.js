// config.js

/*
   _____ _       _
  / ___/(_)___  (_)___  ____ _
  \__ \/ /_  / / / __ \/ __ `/
 ___/ / / / /_/ / / / / /_/ /
/____/_/ /___/_/_/ /_/\__, /
                     /____/
*/

function size(){
	/*
	Sizes the dashboard and widgets
	*/

	// get available height
	let dbh = $(window).height() - $(".navbar").height() - 80;

	// set body height
	$("#dashBody").height(dbh);

	// set row height
	$("#row2").height(dbh - $("#row1").height());

}

size();

/*
 _       ___     __           __
| |     / (_)___/ /___ ____  / /______
| | /| / / / __  / __ `/ _ \/ __/ ___/
| |/ |/ / / /_/ / /_/ /  __/ /_(__  )
|__/|__/_/\__,_/\__, /\___/\__/____/
               /____/
*/

let widgets = {
	'Total Cases KPI' : {
							proto: totalCasesKPI,
							config: {
										targetId: "kpi1"
									}
						},

	"Deaths KPI": 		{
							proto: totalDeathsKPI,
							config: {
										targetId: "kpi2"
									}
						},

	"Recovered KPI": 	{
							proto: recoveredKPI,
							config: {
										targetId: "kpi3"
									}
						},

	"Location List": 	{
							proto: LocationList,
							config: {
										targetId:"list"
									}
						},

	"Trend Chart" : 	{
							proto: TrendChart,
							config: {
										targetId: "chart"
									}
						}
}

let masterWidgetList = [];
let masterWidgetDict = {};

function launchWidgets(){
	$.each(widgets, function(key, val){
		// Initialize each widget
		let proto = val['proto'];
		let config = val['config'];
		let widget = new proto(config);
		masterWidgetList.push(widget);
		masterWidgetDict[key] = widget;
	})
}


/*
    __  ___           __               ______                 __  _
   /  |/  /___ ______/ /____  _____   / ____/_  ______  _____/ /_(_)___  ____  _____
  / /|_/ / __ `/ ___/ __/ _ \/ ___/  / /_  / / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
 / /  / / /_/ (__  ) /_/  __/ /     / __/ / /_/ / / / / /__/ /_/ / /_/ / / / (__  )
/_/  /_/\__,_/____/\__/\___/_/     /_/    \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/
*/
let masterCountry;
let masterState;



/*
    __  __                ____
   / / / /___ _____  ____/ / /__  __________
  / /_/ / __ `/ __ \/ __  / / _ \/ ___/ ___/
 / __  / /_/ / / / / /_/ / /  __/ /  (__  )
/_/ /_/\__,_/_/ /_/\__,_/_/\___/_/  /____/
*/
$(window).resize(function(){
	// resise the dashboard
	size();

	// Reszie the widgets as appropriate
	//TODO
})
