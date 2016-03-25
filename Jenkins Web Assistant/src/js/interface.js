//id of extension
var myid = chrome.runtime.id;

//Global variables
var lastid = 0;

//Div IDs
var listID = 'itemList';	//id of table to print schedule
var urlID = 'enteredURL';	//id of input to retrieve url
var timeID = 'enteredTime'; //id of input to retrieve time
var listErrorID = 'formErrorDiv' //id of div to display list errors


//picture types
var NOSUIT	  = -1
var BLACKSUIT = 0
var BLUESUIT  = 1
var GREENSUIT = 3
var REDUIT	  = 4
var GREYSUIT  = 5


//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;

var maxScheduleLength = 30;


//On page load call functions
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('submitButton').addEventListener('click', function() {
		if(validateFormURL(listErrorID, urlID)) {
			addArrayItem();
		}
	});
	//Puts the array into the list
	arrayToList();

	//Settings
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('reset').addEventListener('click', reset_options);

	//Process history on button click
	document.getElementById('processHistory').addEventListener('click', function() {

		//Call process history from background page
		chrome.extension.getBackgroundPage().processHistory();

		//Needs to refresh page AGAIN to show results
		setTimeout(function() {
			window.location.reload();
		}, 1000);//Wait 1 second and then refresh
	});



	//Set to checked by default at each page load
	document.getElementById('undoNotifications').checked = true;



	//check for permission for notifications
	if (Notification.permission !== "granted")
		Notification.requestPermission();
});






//Ensures all elements of an array are unique
// inspired from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
/*function uniq(array) {
	var seen = {};
	return array.filter(function(item) {
		// for each element checks whether it already contains that element, 
		//   if it does then it skips, if it doesn't then it adds it
		if (seen.hasOwnProperty(item))
			return false;
		else
			return seen[item] = true;
	});
}/**/


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




















//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SCHEDULE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Attempt to build from array
function arrayToList() {
	chrome.storage.sync.get({
		schedule: []
	}, function(items) {
		//First clear all children
		var myNode = document.getElementById(listID);
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}

		//Process errors from list
		items.schedule = items.schedule.filter(function(n){ return n != undefined });
		//Remove duplicates
		items.schedule = chrome.extension.getBackgroundPage().uniq(items.schedule);

		//Add each element to the list
		items.schedule.forEach(function (item, index, array) {
			addScheduleItem(items.schedule, item.time, item.url, item.approved);
		});
	});
}

//Input to array from form
function addArrayItem() {
	chrome.storage.sync.get({
		schedule: []
	}, function(items) {
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


		items.schedule.push(newItem);
		//Remove duplicates
		items.schedule = chrome.extension.getBackgroundPage().uniq(items.schedule);
		//Save updated array
		chrome.storage.sync.set({
			schedule: items.schedule
		}, function() {

		//console.log("Saved");//+++++++++++
		//console.log(items.schedule);//+++++++++++


			//Build list again
			//First clear all children
			var myNode = document.getElementById(listID);
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			//Now replace from array
			items.schedule.forEach(function (item, index, array){
				addScheduleItem(items.schedule, item.time, item.url, item.approved);
			});

			//Clear the form fields
			document.getElementById(timeID).value = "00:00";
			document.getElementById(urlID).value = "";
		});
	});
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
	url.setAttribute('href', makeURL(urlText));
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
		acceptButton.setAttribute('href', '#');
		acceptButton.setAttribute('class', 'trlist-AcceptButton');
		acceptButton.addEventListener('click', function() {
			//Add the new instance to the array 
			addScheduleItem(schedule, time, urlText, true);
			scheduleItem.approved = true;
			schedule.push(scheduleItem);

			//Remove null entries
			schedule = schedule.filter(function(n){ return n != undefined }); 

			chrome.storage.sync.set({
				schedule: schedule
			}, function() {
				//Removes the whole line and replace
				list.removeChild(line);
				//Remove the instance from the array
				replaceInArray(schedule, scheduleItem);
			});
		});
		acception.appendChild(acceptButton);
	}

	//Add remove button
	var removal = document.createElement('td');
	var removeButton = document.createElement('a');
	removeButton.appendChild(document.createTextNode("X"));
	removeButton.setAttribute('href', '#');
	removeButton.setAttribute('class', 'trlist-RemoveButton');
	removeButton.addEventListener('click', function() {
		//Removes the whole line if the X is clicked
		list.removeChild(line);
		//Remove the instance from the array
		removeFromArray(schedule, scheduleItem);

		//if it's an automatic entry, add to the list of removed entries.
		if(!approved) {
			addToRemovedEntries(scheduleItem);
		}
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

		//Save new array
		chrome.storage.sync.set({
			schedule: array
		}, function() {
			var allowUndo = document.getElementById('undoNotifications').checked;
			if (allowUndo) {
				//Notification with "undo" called from background page ~~~~~~~~~~~~~~~~~~~~~~~~~
				chrome.extension.getBackgroundPage().notificationFunction("Item removed", url + " at " + timeText + " has been removed. Click here to undo.", function() {
					//Undo and notify
					//Add to the array exactly where it was removed
					array.splice(pos, 0, removedItem);
					//console.log(removedItem.time);
					array.push(removedItem);

					//Notify and save
					chrome.storage.sync.set({
						schedule: array
					}, function() {
						//Notify user of success of restoration. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
						chrome.extension.getBackgroundPage().notificationURL("Item restored", url + " at " + timeText + " has been restored.", null, GREYSUIT);
						arrayToList();
					});
				});
			}
		});
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
		//var removedItem = array.splice(pos, 1, scheduleItem);
		//console.log(removedItem);//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		//Process errors from list
		array = array.filter(function(n){ return n != undefined }); 
		//Remove duplicates
		array = chrome.extension.getBackgroundPage.uniq(array);
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
function validateFormURL(errorDiv, urlID, scheduleLength) {
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

	
	if (scheduleLength > maxScheduleLength) {
		eDiv.textContent = 'Schedule is full. Please remove existing elements.';
		valid = false;
	}
	else if(urlText == "") {
		eDiv.textContent = 'Please enter a URL.';
		valid = false;
	}
	else if (!pattern.test(urlText)) {
		eDiv.textContent = 'Invalid URL Entered.';
	}



	if(!valid) {
		setTimeout(function() {
			eDiv.textContent = "";
			eDiv.appendChild(document.createElement('br'));
		}, 750);
		return false;
	} else {
		console.log(urlText + " Allowed");
		return true;
	}
}





function addToRemovedEntries(item) {
	chrome.storage.local.get({
		rejectedSchedule: []
	}, function(items) {
		//For readability
		var rejected = items.rejectedSchedule;
		//Sort through rejected schedule for the url
		var found = false;
		for(var i = 0; i < rejected.length && !found; i++) {
			//if found incrememnt number
			if(rejected[i].url == item.url) {
				found = true;
				rejected[i].count++;
				//If number is above threshold then block in further checks
			}
		}
		
		//If not found add to the rejected list
		if(!found) {
			//create object and set attributes
			var newRejected = new Object();
			newRejected.url = item.url;
			newRejected.count = 1;

			//add to array and save
			rejected.push(newRejected);
			chrome.storage.local.set({
				rejectedSchedule: rejected
			}, function() {
				//Unused for now
			});
		}
	})
}



































//++++++++++++++++++++++++++ SAVE SETTINGS +++++++++++++++++++++++++++++++++

// Saves options to chrome.storage
function save_options() {
	//retrieve the settings from the page
	var autoNotifications = document.getElementById('autoNotifications').checked;//---
	var visitSite		= document.getElementById('visitThresholdSite').value;
	var visitPage 		= document.getElementById('visitThresholdPage').value; 	//--
	var weight 	 		= document.getElementById('typedWeight').value; 		//--
	var timer  	 		= document.getElementById('timeThreshold').value;
	var ignored  		= document.getElementById('blacklist').value;
	var checkFrequency  = document.getElementById('checkFrequency').value;		//---
	if (checkFrequency < 1) //Default to 1 if they set it too low
		checkFrequency = 1;
	var timeRounding  	= document.getElementById('timeRounding').value;		//---
	if (timeRounding < 1) //Default to 1 if they set it too low
		timeRounding = 1;
	var newZero  		= document.getElementById('newZero').value;				//---
	//Make sure "trackAfter" is the smaller value
	var trackAfter  	= document.getElementById('trackAfter').value;			//---
	var trackBefore  	= document.getElementById('trackBefore').value;			//---
	if(trackAfter > trackBefore) {
		var trackAfter  = document.getElementById('trackBefore').value;			//---
		var trackBefore = document.getElementById('trackAfter').value;			//---
	}
	var autoCount  	= document.getElementById('autoCount').value;				//---
	var rejectedThreshold = document.getElementById('rejectedThreshold').value; //---

	//Save the settings to memory
	chrome.storage.sync.set({
		visitThreshold: 	visitSite,
		pageVisitThreshold: visitPage,			//--
		typedWeight: 		weight,				//--
		timeThreshold: 		timer,
		ignoreList: 		ignored,
		checkFrequency: 	checkFrequency,		//--
		timeRounding: 		timeRounding,		//--
		newZero: 			newZero,			//--
		trackAfter: 		trackAfter, 		//--
		trackBefore: 		trackBefore, 		//--
		autoNotifications: 	autoNotifications,  //--
		autoCount: 			autoCount,			//--
		rejectedThreshold: 	rejectedThreshold	//--
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = "";
			status.appendChild(document.createElement('br'));
		}, 750);
	});
}/**/





// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	
	// Use default value of true for all and none for blacklist
	chrome.storage.sync.get({
		visitThreshold: 	3,	
		pageVisitThreshold: 9, 		//--
		typedWeight: 		2, 		//--
		timeThreshold: 		28,	
		ignoreList: 		"",	
		checkFrequency: 	5,		//---
		timeRounding: 		1,		//---
		newZero: 			4,		//---
		trackAfter: 		"00:00",//---
		trackBefore: 		"23:59",//---
		autoNotifications: 	false, 	//---
		autoCount: 			20, 	//---
		rejectedThreshold: 	3 		//---
	}, function(items) {
		
		document.getElementById('visitThresholdSite').value		= items.visitThreshold;
		document.getElementById('visitThresholdPage').value		= items.pageVisitThreshold; //--
		document.getElementById('typedWeight').value 			= items.typedWeight; 		//--
		document.getElementById('timeThreshold').value 			= items.timeThreshold;
		document.getElementById('blacklist').value 				= items.ignoreList;
		document.getElementById('checkFrequency').value 		= items.checkFrequency;
		document.getElementById('timeRounding').value 			= items.timeRounding;
		document.getElementById('newZero').value 				= items.newZero;			//----
		document.getElementById('trackAfter').value 			= items.trackAfter;			//---
		document.getElementById('trackBefore').value 			= items.trackBefore;		//---
		document.getElementById('autoNotifications').checked 	= items.autoNotifications; 	//--
		document.getElementById('autoCount').value 				= items.autoCount;			//---
		document.getElementById('rejectedThreshold').value 		= items.rejectedThreshold;	//---
	});
}/**/

function reset_options() {
	//get currently selected settings
	var visitSite			= document.getElementById('visitThresholdSite').value;
	var visitPage 			= document.getElementById('visitThresholdPage').value; 	//---
	var weight 	 			= document.getElementById('typedWeight').value; 		//---
	var timer  	 			= document.getElementById('timeThreshold').value;
	var ignored  			= document.getElementById('blacklist').value;
	var checkFrequency  	= document.getElementById('checkFrequency').value;		//---
	var timeRounding  		= document.getElementById('timeRounding').value;		//---
	var newZero  			= document.getElementById('newZero').value;				//---
	var trackAfter  		= document.getElementById('trackAfter').value;			//---
	var trackBefore  		= document.getElementById('trackBefore').value;			//---
	var autoNotifications 	= document.getElementById('autoNotifications').checked; //---
	var autoCount  			= document.getElementById('autoCount').value;			//---
	var rejectedThreshold  	= document.getElementById('rejectedThreshold').value;	//---
	
	//overwrite with default
	document.getElementById('visitThresholdSite').value		= 3;
	document.getElementById('visitThresholdPage').value		= 9;//--
	document.getElementById('typedWeight').value 			= 2;//--
	document.getElementById('timeThreshold').value 			= 28;
	document.getElementById('blacklist').value 				= "";
	document.getElementById('checkFrequency').value 		= 5; //--
	document.getElementById('timeRounding').value 			= 1; //--
	document.getElementById('newZero').value 				= 4; //--
	document.getElementById('trackAfter').value 			= "00:00"; //--
	document.getElementById('trackBefore').value 			= "23:59"; //--
	document.getElementById('autoNotifications').checked 	= false;//--
	document.getElementById('autoCount').value 				= 20; //--
	document.getElementById('rejectedThreshold').value 		= 3; //--

	// Update status to let user know options were reset.
	var status = document.getElementById('status');
	status.textContent = 'Options have been reset to default.';


	//Create an "undo" option for if it is accidentally clicked
	var a = document.createElement('a');
	a.href = '#reset';
	a.appendChild(document.createTextNode(" undo"));
	a.addEventListener('click', function() {
		//For when undo is called
		var status = document.getElementById('status');
		status.textContent = "";
		status.appendChild(document.createElement('br'));

		//restore settings
		document.getElementById('visitThresholdSite').value 	= visitSite;
		document.getElementById('visitThresholdPage').value 	= visitPage; 	 	//--
		document.getElementById('timeThreshold').value 			= timer; 		 	//--
		document.getElementById('timeThreshold').value 			= timer;
		document.getElementById('blacklist').value 				= ignored;
		document.getElementById('checkFrequency').value 		= checkFrequency;	//--
		document.getElementById('timeRounding').value 			= timeRounding;		//--
		document.getElementById('newZero').value 				= newZero;			//--
		document.getElementById('trackAfter').value 			= trackAfter;		//--
		document.getElementById('trackBefore').value 			= trackBefore;		//--
		document.getElementById('autoNotifications').checked  	= autoNotifications;//--
		document.getElementById('autoCount').value 				= autoCount;		//--
		document.getElementById('rejectedThreshold').value 		= rejectedThreshold;//--
	});
	status.appendChild(a);
}/**/

