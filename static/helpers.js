// helpers.js

let masterIdList = [];
function generateId(){
	/*
	Returns an ID that has not yet been used
	*/
	let i = 0;
	let cont = true;
	while (cont){
		if (masterIdList.indexOf(i) == -1){
			// new id
			cont = false;
			masterIdList.push(i);
		}
		else{
			i += 1;
		}
	}
	return i;
}

function deepCopy(d){
	s = JSON.stringify(d);
	return JSON.parse(s);
}
