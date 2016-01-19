//id of extension
var myid = chrome.runtime.id;

//Global variables
var historyPermission = true;
var timerSetting = 0;

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
	//Promise means it won't be called too late
	var p = new Promise(function (resolve, reject) {
		chrome.storage.sync.get({
			history: true,
			timer:28
		}, function (items) {
			historyPermission = items.history;
			timerSetting = items.timer;
			resolve(historyPermission);
		});
	});
	p.then(function (historyPermission) {
		buildHistoryList("linked", "link");
		buildHistoryList("typed", "typed");
		buildHistoryList("reloaded", "reload");
	});
	buildIgnoreList("blacklist");
	buildTopSitesList("topSites");
});








//=================================== NOT My content ========================
//The following work has been copied mostly unedited from online.
//I'm not sure how much this is alowed so I will need to ask...

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
	var popupDiv = document.getElementById(divName);

	var ul = document.createElement('ul');
	popupDiv.appendChild(ul);

	for (var i = 0, ie = data.length; i < ie; ++i) {
		var li = document.createElement('li');

		if(data[i] == 'Jenkins Web Assistant') {
			li.appendChild(document.createTextNode(data[i] + ' Extension'));
		}
		else {
			var a = document.createElement('a');
			url = 'http://' + data[i];
			a.href = url;
			a.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
			a.appendChild(document.createTextNode(data[i]));
			li.appendChild(a);
		}

		ul.appendChild(li);
	}
}
//=============================================================================








function buildHistoryList(divName, transitionType) {

	//Stop if we don't have permission
	if(historyPermission != true){
		return;
		//This will end the funtion prematurely
	}

	// To look for history items visited in the last amount of time,
	// subtract that amount of time in microseconds from the current time.
	var microsecondsPerDay = 1000 * 60 * 60 * 24;
	


	//Multiply 1 day by the amount of days set by user.
	var historyCutoff = (new Date).getTime() - (microsecondsPerDay * timerSetting);

	// Track the number of callbacks from chrome.history.getVisits()
	// that we expect to get.	When it reaches zero, we have all results.
	var numRequestsOutstanding = 0;

	chrome.history.search({
			'text': '',							// Return every history item....
			'startTime': historyCutoff	// that was accessed less than one week ago.
		},
		function(historyItems) {
			// For each history item, get details on all visits.
			for (var i = 0; i < historyItems.length; ++i) {
				var url = historyItems[i].url;
				var processVisitsWithUrl = function(url) {
					// We need the url of the visited item to process the visit.
					// Use a closure to bind the	url into the callback's args.
					return function(visitItems) {
						processVisits(url, visitItems);
					};
				};
				chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
				numRequestsOutstanding++;
			}
			if (!numRequestsOutstanding) {
				printList();
			}
		});

	// Maps URLs to a count of the number of times the user typed that URL into
	// the omnibox.
	var urlToCount = {};

	// Callback for chrome.history.getVisits().	
	// shows all urls visited
	var processVisits = function(url, visitItems) {
		for (var i = 0, ie = visitItems.length; i < ie; ++i) {
			//ignore reloaded pages
			if (visitItems[i].transition != transitionType) {
				continue;
			}

			if (!urlToCount[url]) {
				urlToCount[url] = 0;
			}

			urlToCount[url]++;
		}

		// If this is the final outstanding call to processVisits(),
		// then we have the final results.	Use them to build the list
		// of URLs to show in the popup.
		if (!--numRequestsOutstanding) {
			printList();
		}
	};

	//splits the url into hostname and pathname
	// inspired from http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
	// Relies upon DOM to process the url (Therefore only works in browser)
	var getHostname = function(url) {
		//make object element. a represents anchor... not element name...
		var forProcessing = document.createElement("a");

		//make url into href for object
		forProcessing.href = url;
		//return hostname section
		return forProcessing.hostname;

		//===OTHER POSSIBILITIES===
		//For if it matches criteria such as Google or Amazon etc.

		//forProcessing.protocol; // => "http:"
		//forProcessing.host;	 // => "example.com:3000"
		//forProcessing.hostname; // => "example.com"
		//forProcessing.port;	 // => "3000"
		//forProcessing.pathname; // => "/pathname/"
		//forProcessing.hash;	 // => "#hash"
		//forProcessing.search;	 // => "?search=test"
	};
	var printList = function() {
		//define array to be printed
		wordArray = [];

		for (var url in urlToCount) {
			var word = getHostname(url);
			if (word == myid)
				word = "Jenkins Web Assistant";
			wordArray.push(word);
		}
		//END TESTING ============

		//Remove duplicates
		wordArray = uniq(wordArray);

		//Slices to first 10 words encountered and sends to be printed into list
		buildPopupDom(divName, wordArray.slice(0,25));
	};
}







//Ensures all elements of an array are unique
// inspired from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
function uniq(array) {
	var seen = {};
	return array.filter(function(item) {
		//return seen.hasOwnProperty(item) ? false : (seen[item] = true); //Original

		//My version for help in understanding
		// for each element checks whether it already contains that element, 
		//   if it does then it skips, if it doesn't then it adds it
		if (seen.hasOwnProperty(item))
			return false;
		else
			return seen[item] = true;
	});
}





////Retrieves and displays blacklist
function buildIgnoreList(divName) {
	chrome.storage.sync.get({
		ignored: ""
	}, function(items) {
		var blacklist = document.getElementById(divName);
		var data = items.ignored.split(",");
		//if empty
		if (data.length == 1 && data[0] == "") {
			data = ["Ignore list is currently empty."];
		}

		var ul = document.createElement('ul');
		blacklist.appendChild(ul);

		for (var i = 0, ie = data.length; i < ie; ++i) {
			var li = document.createElement('li');
			li.appendChild(document.createTextNode(data[i]));

			ul.appendChild(li);
		}
	});
}




function buildTopSitesList(divName) {
	chrome.storage.sync.get({
		topsites: true
	}, function(items) {
		if (items.topsites) {
			chrome.topSites.get(function(data) {
				var div = document.getElementById(divName);
				var ul = document.createElement('ul');
				div.appendChild(ul);
	
				for (var i = 0, ie = data.length; i < ie; ++i) {
					var li = document.createElement('li');
					var a = document.createElement('a');

					a.href = data[i].url;
					a.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
					a.appendChild(document.createTextNode(data[i].title));
					li.appendChild(a);
					ul.appendChild(li);
				}
			});
		}
		else
			return;
	});
}

















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
		notif: true
	}, function(items) {
		if (items.notif == true) {
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
		notif: true
	}, function(items) {
		if (items.notif == true) {
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




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Inspired by http://stackoverflow.com/questions/23504528/dynamically-remove-items-from-list-javascript
var lastid = 0; /*
function addListItem(listID, urlID, timeID) {
	//Format the text to be displayed and saved
	var timeText = document.getElementById(timeID).value;
	var text = " at " + timeText;
	//Make the url a working anchor
	var urlText = document.getElementById(urlID).value;
	var url = document.createElement("a");
	url.setAttribute('href', 'http://' + urlText);
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.appendChild(document.createTextNode(urlText));
	//Checks the document for the list table
	var list = document.getElementById(listID);
	//Makes a new line to be added to the list and sets the id
	var line = document.createElement('tr');
	line.setAttribute('id','item'+lastid);
	line.setAttribute('class', 'trlist');

	//Puts the text into the first element of the row
	var entry = document.createElement('td');
	entry.appendChild(url);
	//entry.appendChild("Scheduled for ");
	entry.appendChild(document.createTextNode(text));
	entry.setAttribute('class', 'trlist-Entry');

	//Add remove button
	var removal = document.createElement('td');
	var removeButton = document.createElement('a');
	removeButton.appendChild(document.createTextNode("X"));
	removeButton.setAttribute('href', '#');
	removeButton.setAttribute('class', 'trlist-RemoveButton');
	removeButton.addEventListener('click', function() {
		//Removes the whole line if the X is clicked
		list.removeChild(line);
	});
	removal.appendChild(removeButton);
	lastid+=1;
	line.appendChild(entry);
	line.appendChild(removal);
	//Add line to list
	list.appendChild(line);

	//Clear the form fields
	document.getElementById(timeID).value = 0;
	document.getElementById(urlID).value = "";
}/**/



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Attempt to build from array
function arrayToList() {
	chrome.storage.sync.get({
		schedule: []
	}, function(items) {
		//Add each element to the list
		items.schedule.forEach(function (item, index, array){
			var whole = item + '';	//Causes error otherwise
			var fragments = whole.split(",");
			addScheduleItem(items.schedule, fragments[0], fragments[1]);
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
		items.schedule.push(timeText + "," + urlText);
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
				addScheduleItem(items.schedule, fragments[0], fragments[1]);
			});

			//Clear the form fields
			document.getElementById(timeID).value = "00:00";
			document.getElementById(urlID).value = "";
		});
	});
}

//Prints list from array
function addScheduleItem(schedule, timeText, urlText) {
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
	line.setAttribute('class', 'trlist');

	//Puts the text into the first element of the row
	var entry = document.createElement('td');
	//entry.appendChild("Scheduled for ");
	entry.appendChild(document.createTextNode(text));
	entry.appendChild(url);
	entry.setAttribute('class', 'trlist-Entry');

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
	line.appendChild(removal);
	//Add line to list
	list.appendChild(line);
}/**/

function removeFromArray(array, object) {
	var pos = array.indexOf(object);
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
					notificationURL("Item restored", removedItem + " has been restored. Click here to undo.");
					arrayToList();
				});
			});
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

