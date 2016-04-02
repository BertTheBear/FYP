//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;




//picture types
var NOSUIT	  = -1
var BLACKSUIT = 0
var BLUESUIT  = 1
var GREENSUIT = 3
var REDUIT	  = 4
var GREYSUIT  = 5

var background = chrome.extension.getBackgroundPage();

var myUrl = "https://chrome.google.com/webstore/detail/jenkins-web-assistant/bkedakmhhaabpailgdoikgkkdlkahkil?hl=en-GB";
var schedule = [];


//Div IDs
var listID = 'itemList';	//id of table to print schedule
var urlID = 'enteredURL';	//id of input to retrieve url
var timeID = 'enteredTime'; //id of input to retrieve time
var listErrorID = 'formErrorDiv' //id of div to display list errors
var lastid = 0


// +++ Triggers +++
//set triggers 
document.addEventListener('DOMContentLoaded', function() {
	//For opening options page
	document.getElementById('option').addEventListener('click', background.open_options);

	//For examples in scheduler section
	document.getElementById('userNotification').addEventListener('click', function(){
		var messageContent = "This is a sample User Notification.\nClick here to open the Store Page.\nClick the 'X' in the top right corner to dismiss this message.";
		background.notificationURL("User Notification", messageContent, myUrl, GREENSUIT);
	});
	document.getElementById('autoNotification').addEventListener('click', function(){
		var messageContent = "This is a sample Automatic Notification.\nClick here to open the Store Page.\nClick the 'X' in the top right corner to dismiss this message.";
		background.notificationURL("Automatic Notification", messageContent, myUrl, BLUESUIT);
	});

	//for adding to schedule sample
	document.getElementById('submitButton').addEventListener('click', function() {
		if(validateFormURL(listErrorID, urlID)) {
			addArrayItem(schedule);
		}
	});

	//Fill the sample schedule
	populate();
});








// ================ SAMPLE SCHEDULE ====================
//populate the array
function populate() {

	//Now in just today's microseconds
	var now = (Date.now() % microsecondsPerDay);
	now = now - (now % microsecondsPerMinute);

	//STUPID DAYLIGHT SAVINGS
	now = now + microsecondsPerHour;



	//POPULATE THE ARRAY
	//Set the times for the recommender
	schedule = [];
	//Just a few sample websites picked
	var websites = ["rte.ie", "ul.ie", "www.csis.ul.ie", "rte.ie", "play.spotify.com", "bbc.com", "en.wikipedia.com", "rte.ie"];
	var index = 0;
	//For loop setting times
	for(var i = 0; index < websites.length; i += 12) {
		var timeToAdd = microsecondsPerMinute * i;

		var item = new Object();
		item.url = websites[index];
		item.time = (now + timeToAdd) - ((now + timeToAdd) % (microsecondsPerMinute));
		item.approved = false;
		if((i % 9) == 3) {
			item.approved = true;
		}

		//add item to array
		schedule.push(item);

		//increment index
		index++;
	}

	arrayToList(schedule);
}
// Attempt to build from array
function arrayToList(schedule) {

	//First clear all children
	var myNode = document.getElementById(listID);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}


	//Add each element to the list
	schedule.forEach(function (item, index, array) {
		addScheduleItem(array, item.time, item.url, item.approved);
	});
}

//Input to array from form
function addArrayItem(schedule) {
	//Add elements to the array
	var urlText = document.getElementById(urlID).value;
	var timeText = document.getElementById(timeID).value;

	//Get time info from the string
	var time = new Date(0);
	var index = timeText.indexOf(":");//Location of :
	var hours = parseFloat(timeText.substring(index-2, index)); //2 values before : character
	var minutes = parseFloat(timeText.substring(index+1, index+3)); //2 values after : 
	//add times to new Date
	time.setMinutes(minutes);
	time.setHours(hours);

	//Create new item to be saved
	var newItem = Object();
	newItem.time = time.getTime(); //Cannot be saved as Date
	newItem.url = urlText;
	newItem.approved = true;

	//console.log(newItem);//+++++++++++


	schedule.push(newItem);
	//Build list again
	//First clear all children
	var myNode = document.getElementById(listID);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	//Now replace from array
	schedule.forEach(function (item, index, array){
		addScheduleItem(array, item.time, item.url, item.approved);
	});

	//Clear the form fields
	document.getElementById(timeID).value = "00:00";
	document.getElementById(urlID).value = "";
}

//Prints list from array
function addScheduleItem(schedule, time, urlText, approved) {
	var scheduleItem = new Object;
	scheduleItem.time = time;
	scheduleItem.url = urlText;
	scheduleItem.approved = approved;
	//Set type var
	var type = "trlist-auto";
	if(approved) {
		type = "trlist-user";
	}

	//Format the text to be displayed
	var timeText = "";
	var hours = (time - (time % microsecondsPerHour)) / microsecondsPerHour;
	timeText += hours + ":";
	var minutes = (time % microsecondsPerHour) / microsecondsPerMinute;
	if (minutes < 10) {
		//To prevent 12:7 etc.
		timeText += "0";
	}
	timeText += minutes;
	var text = "At " + timeText + " open ";

	//Make the url a working anchor
	var url = document.createElement("a");
	url.setAttribute('href', background.makeURL(urlText));
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.appendChild(document.createTextNode(urlText));
	//Checks the document for the list table
	var list = document.getElementById(listID);
	//Makes a new line to be added to the list and sets the id
	var line = document.createElement('tr');
	//For removing from list
	line.setAttribute('id','item'+lastid);

	//Set type user/automatic
	//trlist-user => user set (green)
	//trlist-auto => automatically set (blue)
	line.setAttribute('class', type);

	//Puts the text into the first element of the row
	var entry = document.createElement('td');
	//entry.appendChild("Scheduled for ");
	entry.appendChild(document.createTextNode(text));
	entry.appendChild(url);
	entry.setAttribute('class', 'trlist-Entry');

	//Add accept button
	var acception = document.createElement('td');
	if(type.includes("auto")) {
		var acceptButton = document.createElement('a');
		acceptButton.appendChild(document.createTextNode("Accept"));
		acceptButton.setAttribute('href', '#' + listID);
		acceptButton.setAttribute('class', 'trlist-AcceptButton');
		acceptButton.addEventListener('click', function() {
			//Add the new instance to the array 
			addScheduleItem(schedule, time, urlText, true);
			scheduleItem.approved = true;
			schedule.push(scheduleItem);

			//Remove null entries
			schedule = schedule.filter(function(n){ return n != undefined }); 

			//Removes the whole line and replace
			list.removeChild(line);
			//Remove the instance from the array
			replaceInArray(schedule, scheduleItem);
		});
		acception.appendChild(acceptButton);
	}

	//Add remove button
	var removal = document.createElement('td');
	var removeButton = document.createElement('a');
	removeButton.appendChild(document.createTextNode("X"));
	removeButton.setAttribute('href', '#' + listID);
	removeButton.setAttribute('class', 'trlist-RemoveButton');
	removeButton.addEventListener('click', function() {
		//Removes the whole line if the X is clicked
		list.removeChild(line);
		//Remove the instance from the array
		removeFromArray(schedule, scheduleItem);
	});
	removal.appendChild(removeButton);
	lastid+=1;
	line.appendChild(entry);
	line.appendChild(acception);
	line.appendChild(removal);
	//Add line to list
	list.appendChild(line);
}/**/

function removeFromArray(array, scheduleItem) {
	var approved = scheduleItem.approved;
	var url = scheduleItem.url;
	var time = scheduleItem.time;

	//Format the text to be displayed
	var timeText = "";
	var hours = (time - (time % microsecondsPerHour)) / microsecondsPerHour;
	timeText += hours + ":";
	var minutes = (time % microsecondsPerHour) / microsecondsPerMinute;
	if (minutes < 10) {
		//To prevent 12:7 etc.
		timeText += "0";
	}
	timeText += minutes;

	//More intensive search
	var found = false;
	var pos = -1;
	for(var i = 0; i < array.length && !found; i++) {
		var toCheck = array[i];
		//If all variables are the same it's a duplicate
		if(toCheck.time == time && toCheck.url == url && toCheck.approved == approved) {
			found = true;
			pos = i;
		}
	}
	if (!found) {
		//Call notification functions from background page ~~~~~~~~~~~~~~~~~~~~~~~~~~~
		chrome.extension.getBackgroundPage().notificationURL("Error", "Unable to remove entry \"" + url + "\". Please notify Mikey.", null, REDSUIT);
	}
	else {
		//remove item from array
		var removedItem = array[pos];
		array.splice(pos, 1);
	}
}/**/
function replaceInArray(array, scheduleItem) {
	var approved = scheduleItem.approved;
	var url = scheduleItem.url;
	var time = scheduleItem.time;


	//More intensive search
	var found = false;
	var pos = -1;
	for(var i = 0; i < array.length && !found; ++i) {
		var toCheck = array[i];
		//If all variables are the same it's a duplicate
		if(toCheck.time == time && toCheck.url == url && toCheck.approved == false) {
			found = true;
			pos = i;
		}
	}
	if (!found) {
		//Call notification functions from background page ~~~~~~~~~~~~~~~~~~~~~~~~~~~
		chrome.extension.getBackgroundPage().notificationURL("Error", "Unable to find entry \"" + url + "\". Please notify Mikey.", null, REDSUIT);
	}
	else if (pos > -1) {
		array = array.filter(function(n){ return n != undefined }); 
		//Remove duplicates
		array = background.uniq(array);
		//Save new array
		chrome.storage.sync.set({
			schedule: array
		}, function() {
			console.log(array);//++++++++++++++

			//Notification with "undo"
			chrome.extension.getBackgroundPage().notificationURL("Recommendation Validated", array[pos].url + " has been Validated.", null, GREYSUIT);
		});
	}
}/**/


//Verifies that the input is a working URL
function validateFormURL(errorDiv, urlID) {
	//Get values
	var urlText = document.getElementById(urlID).value;
	//Check values
	var pattern = new RegExp("^((https|http|ftp|rtsp|mms)?://)"	//Protocol
		+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp user
		+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" // OR	//IP(v4) address
		+ "([0-9a-z_!~*'()-]+\.)*" 						// www.
		+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." 		// domain name
		+ "[a-z]{2,6})" 								// first level domain- .com or .museum
		+ "(:[0-9]{1,4})?" 								// port number
		+ "((/?)|" 										// a slash isn't required if there is no file name
		+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",'i'); // fragment locater



	// Update status to let user know options were saved.
	var eDiv = document.getElementById(errorDiv);
	var valid = true;

	if(urlText == "") {
		eDiv.textContent = 'Please enter a URL.';
		valid = false;
	}
	else if (!pattern.test(urlText)) {
		eDiv.textContent = 'Invalid URL Entered.';
		valid = false;
	}



	if(!valid) {
		setTimeout(function() {
			eDiv.textContent = "";
			eDiv.appendChild(document.createElement('br'));
		}, 750);
		return false;
	} else {
		console.log(urlText + " Allowed"); //+++++++++++
		return true;
	}
}



function makeURL(destination) {
	var protocol = new RegExp("^((https|http|ftp|rtsp|mms)://)",'i');
	if(!protocol.test(destination)) {
		//Not a working URL, just add protocol
		return "http://" + destination;
	}
	else {
		//Everything's alright
		return destination;
	}
}/**/