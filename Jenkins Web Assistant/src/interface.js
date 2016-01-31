//id of extension
var myid = chrome.runtime.id;

//Global variables
var historyPermission = true;
var timerSetting = 0;
var lastid = 0;

//Div IDs
var listID = 'itemList';	//id of table to print schedule
var urlID = 'enteredURL';	//id of input to retrieve url
var timeID = 'enteredTime'; //id of input to retrieve time
var listErrorID = 'formErrorDiv' //id of div to display list errors

//On page load call functions
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('blah').addEventListener('click', function() {
		if(validateFormURL(listErrorID, urlID)) {
			addArrayItem();
		}
	});
	arrayToList();

	//check for permission for notifications
	if (Notification.permission !== "granted")
		Notification.requestPermission();

	//Check first whether we have permission.
	chrome.storage.sync.get({
		history: true,
		timer:28
	}, function (items) {
		historyPermission = items.history;
		timerSetting = items.timer;
	});
});






//Ensures all elements of an array are unique
// inspired from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
function uniq(array) {
	var seen = {};
	return array.filter(function(item) {
		// for each element checks whether it already contains that element, 
		//   if it does then it skips, if it doesn't then it adds it
		if (seen.hasOwnProperty(item))
			return false;
		else
			return seen[item] = true;
	});
}















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
		//Add each element to the list
		items.schedule.forEach(function (item, index, array){
			var whole = item + '';	//Causes error otherwise
			var fragments = whole.split(",");
			addScheduleItem(items.schedule, fragments[0], fragments[1], fragments[2]);
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
		items.schedule.push(timeText + "," + urlText + ",trlist-user");
		//Remove duplicates
		items.schedule = uniq(items.schedule);
		//Save updated array
		chrome.storage.sync.set({
			schedule: items.schedule
		}, function() {
			//Build list again
			//First clear all children
			var myNode = document.getElementById(listID);
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			//Now replace from array
			items.schedule.forEach(function (item, index, array){
				var whole = item + '';	//Causes error otherwise
				var fragments = whole.split(",");
				addScheduleItem(items.schedule, fragments[0], fragments[1], fragments[2]);
			});

			//Clear the form fields
			document.getElementById(timeID).value = "00:00";
			document.getElementById(urlID).value = "";
		});
	});
}

//Prints list from array
function addScheduleItem(schedule, timeText, urlText, type) {
	//Format the text to be displayed and saved
	var text = "At " + timeText + " open ";
	//Make the url a working anchor
	var url = document.createElement("a");
	url.setAttribute('href', 'http://' + urlText);
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.appendChild(document.createTextNode(urlText));
	//Checks the document for the list table
	var list = document.getElementById(listID);
	//Makes a new line to be added to the list and sets the id
	var line = document.createElement('tr');
	line.setAttribute('id','item'+lastid);

	//Set type user/automatic
	//trlist-user => user set
	//trlist-auro => automatically set
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
			addScheduleItem(schedule, timeText, urlText, ",trlist-user");
			schedule.unshift(timeText + "," + urlText + ",trlist-user");
			chrome.storage.sync.set({
				schedule: schedule
			}, function() {
				//Removes the whole line if the X is clicked
				list.removeChild(line);
				//Remove the instance from the array
				replaceInArray(schedule, timeText + "," + urlText);
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
		removeFromArray(schedule, timeText + "," + urlText);
	});
	removal.appendChild(removeButton);
	lastid+=1;
	line.appendChild(entry);
	line.appendChild(acception);
	line.appendChild(removal);
	//Add line to list
	list.appendChild(line);
}/**/

function removeFromArray(array, object) {
	var pos = array.indexOf(object);
	if(pos == -1) {
		//More intensive search
		var found = false;
		for(var i = 0; i < array.length && !found; i++) {
			if(array[i].includes(object)) {
				found = true;
				pos = i;
			}
		}
		if (!found)
			notificationURL("Error", "Unable to find entry \"" + object + "\". Please notify Mikey.");
	}
	var removedItem = array.splice(pos, 1);
	//Save new array
	chrome.storage.sync.set({
			schedule: array
		}, function() {
			//Notification with "undo"
			notificationFunction("Item removed", removedItem + " has been removed. Click here to undo.", function() {
				//Undo and notify
				array.push(removedItem);
				chrome.storage.sync.set({
					schedule: array
				}, function() {
					notificationURL("Item restored", removedItem + " has been restored.");
					arrayToList();
				});
			});
	});
}/**/
function replaceInArray(array, object) {
	var pos = array.indexOf(object);
	if(pos == -1) {
		//More intensive search
		var found = false;
		for(var i = 0; i < array.length && !found; i++) {
			if(array[i].includes(object)) {
				found = true;
				pos = i;
			}
		}
		if (!found)
			notificationURL("Error", "Unable to find entry \"" + object + "\". Please notify Mikey.");
	}
	var removedItem = array.splice(pos, 1);
	//Save new array
	chrome.storage.sync.set({
			schedule: array
		}, function() {
			//Notification with "undo"
			notificationURL("Recommendation Validated", removedItem + " has been Validated.");
		});
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
	if(!pattern.test(urlText)) {
		console.log(urlText + " Refused");// Update status to let user know options were saved.
		var eDiv = document.getElementById(errorDiv);
		if(urlText == "") {
			eDiv.textContent = 'Please enter a URL.';
		}
		else {
			eDiv.textContent = 'Invalid URL Entered.';
		}

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































//++++++++++++++++++++++++++++++ NOTIFICATIONS +++++++++++++++++++++++++++++++++++++++++++

//Polymorphism for no destination var
function notificationURL(notificationTitle, bodyText) {
	notificationURL(notificationTitle, bodyText, null);
}
//influenced from http://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
function notificationURL(notificationTitle, bodyText, destination) {

	var iconImage = '/images/128.png'; //Default. Likely won't be changed


	if (!Notification) {
		alert('Desktop notifications not available in your browser. Try Chromium.'); 
		return;
	}
	chrome.storage.sync.get({
		notification: true
	}, function(items) {
		if (items.notification == true) {
			var notification = new Notification(notificationTitle, {
				icon: iconImage,
				body: bodyText,
			});
			//Whatever I want the notification to do
			notification.onclick = function () {
				if (destination != null)
					window.open(destination);
				//Placeholder
				notification.close();
			};
		}
	});
}


function notificationFunction(notificationTitle, bodyText, func) {
	notificationFunction(notificationTitle, bodyText, func, null);
}
function notificationFunction(notificationTitle, bodyText, func, funcparam) {
	var iconImage = '/images/128.png'; //Default. Likely won't be changed


	if (!Notification) {
		alert('Desktop notifications not available in your browser. Try Chromium.'); 
		return;
	}
	chrome.storage.sync.get({
		notification: true
	}, function(items) {
		if (items.notification == true) {
			var notification = new Notification(notificationTitle, {
				icon: iconImage,
				body: bodyText,
			});
			//Whatever I want the notification to do
			notification.onclick = function () {
				if (funcparam != null)
					func(funcparam);
				else
					func();
				//Placeholder
				notification.close();
			};
		}
	});
}
