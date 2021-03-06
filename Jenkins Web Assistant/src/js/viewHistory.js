//id of extension
var myid = chrome.runtime.id;

//Global variables
var historyPermission = true;
var timerSetting = 0;

//picture types
var NOSUIT	  = -1
var BLACKSUIT = 0
var BLUESUIT  = 1
var GREENSUIT = 3
var REDUIT	  = 4
var GREYSUIT  = 5

//Div IDs
var listID = 'itemList';	//id of table to print schedule
var urlID = 'enteredURL';	//id of input to retrieve url
var timeID = 'enteredTime'; //id of input to retrieve time
var listErrorID = 'formErrorDiv' //id of div to display list errors


//How many minutes to wait
var minutesPerInterval = 5;
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;
//time to wait between schedule checks
var timeToWait = microsecondsPerMinute * minutesPerInterval;


//On page load call functions
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('blah').addEventListener('click', function() {
		if(validateFormURL(listErrorID, urlID)) {
			addArrayItem();
		}
	});
	arrayToList();
	document.getElementById('bloh').addEventListener('click', function() {
		//chrome.extension.getBackgroundPage().checkSchedule();
		thing();
	});
	document.getElementById('bleh').addEventListener('click', chrome.extension.getBackgroundPage().clearHistory);
	document.getElementById('rer').addEventListener('click', function(){
		chrome.storage.sync.clear();
	});

	//check for permission for notifications
	if (Notification.permission !== "granted")
		Notification.requestPermission();

	//Check first whether we have permission.
	//Promise means it won't be called too late
	var p = new Promise(function (resolve, reject) {
		chrome.storage.sync.get({
			history: true,
			timeThreshold: 28
		}, function (items) {
			historyPermission = items.history;
			timerSetting = items.timeThreshold;
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
	buildBookmarkList("bookmarks");
});








//=================================== NOT My content ========================
//The following work has been copied and edited from online.
//I'm not sure how much this is allowed so I will need to ask...

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
		ignoreList: ""
	}, function(items) {
		var blacklist = document.getElementById(divName);
		var data = items.ignoreList.split(",");
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


function buildBookmarkList(divName) {
	chrome.storage.sync.get({
		bookmarks: true
	}, function(items) {
		if (items.bookmarks) {
			chrome.bookmarks.getRecent(20, function(results) {
				var div = document.getElementById(divName);
				var ul = document.createElement('ul');
				div.appendChild(ul);
				
				if(results != null) {
					for (var i = 0, ie = results.length; i < ie; ++i) {
						var li = document.createElement('li');
						var a = document.createElement('a');

						a.href = results[i].url;
						a.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
						a.appendChild(document.createTextNode(results[i].title));
						li.appendChild(a);
						ul.appendChild(li);
					}
				}
			});
		}
		else
			return;
	});
}












//Quick fix for test page

//Polymorphism for no destination var
function notificationURL(notificationTitle, bodyText) {
	notificationURL(notificationTitle, bodyText, null);
}
//influenced from http://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
function notificationURL(notificationTitle, bodyText, destination) {

	chrome.extension.getBackgroundPage().notificationURL(notificationTitle, bodyText, destination);
}


function notificationFunction(notificationTitle, bodyText, func) {
	notificationFunction(notificationTitle, bodyText, func, null);
}
function notificationFunction(notificationTitle, bodyText, func, funcparam) {
	chrome.extension.getBackgroundPage().notificationFunction(notificationTitle, bodyText, func, funcparam);
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Inspired by http://stackoverflow.com/questions/23504528/dynamically-remove-items-from-list-javascript
var lastid = 0; 


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
			if (!(item.time instanceof Date)) {
				//Remove from list
				var removed = array.splice(index, 1);
				console.log("Removed:"); //++++++
				console.log(removed);//++++++++++
			}
			else
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
		console.log(timeText);//++++++++++
		console.log(hours);//++++++++++
		var minutes = parseFloat(timeText.substring(index+1, index+3)); //2 values after : 
		console.log(minutes);//++++++++++
		//add times to new Date
		time.setMinutes(minutes);
		time.setHours(hours);

		console.log(time);//++++++++++

		var newItem = Object();
		newItem.time = time;
		newItem.url = urlText;
		newItem.approved = true;

		console.log(newItem);//+++++++++++


		items.schedule.push(newItem);
		//Remove duplicates
		//items.schedule = uniq(items.schedule);
		//Save updated array
		chrome.storage.sync.set({
			schedule: items.schedule
		}, function() {

		console.log("Saved");//+++++++++++
		console.log(items.schedule);//+++++++++++


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
	console.log(time);//++++++++++++++

	//Format the text to be displayed and saved
	var timeText = "";
	timeText += time.getHours() + ":";
	if (timeText.getMinutes < 10) {
		//To prevent 12:7 etc.
		timeText += "0";
	}
	timeText += timeText.getMinutes;
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
			addScheduleItem(items.schedule, time, urlText, true);
			schedule.push(acceptedItem);
			chrome.storage.sync.set({
				schedule: schedule
			}, function() {
				//Removes the whole line if the X is clicked
				list.removeChild(line);
				//Remove the instance from the array
				replaceInArray(schedule, scheduleItem);//=================================================================================================================================================================================================
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
		chrome.extension.getBackgroundPage().notificationURL("Error", "Unable to find entry \"" + url + "\". Please notify Mikey.");
	}
	else {
		//remove item from array
		var removedItem = array.splice(pos, 1);
		//Save new array
		chrome.storage.sync.set({
			schedule: array
		}, function() {
			var allowUndo = document.getElementById('undoNotifications').checked;
			if (allowUndo) {
				//Notification with "undo" called from background page ~~~~~~~~~~~~~~~~~~~~~~~~~
				chrome.extension.getBackgroundPage().notificationFunction("Item removed", removedItem + " has been removed. Click here to undo.", function() {
					//Undo and notify
					array.push(removedItem);
					chrome.storage.sync.set({
						schedule: array
					}, function() {
						//Notify user of success of restoration. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
						chrome.extension.getBackgroundPage().notificationURL("Item restored", removedItem + " has been restored.");
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
		chrome.extension.getBackgroundPage().notificationURL("Error", "Unable to find entry \"" + url + "\". Please notify Mikey.");
	}
	else {
		var removedItem = array.splice(pos, 1);
		//Save new array
		chrome.storage.sync.set({
			schedule: array
		}, function() {
			//Notification with "undo"
			chrome.extension.getBackgroundPage().notificationURL("Recommendation Validated", url + " has been Validated.");
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









//>>>>>>>>>>>>>>>>>>> Recommender <<<<<<<<<<<<<<<<<<<<<<
/*function recommend() {
	
}*/



function thing() {
	chrome.storage.sync.get(function(items) {
		console.log(items);
	})
	chrome.storage.local.get(function(items) {
		console.log(items);
	})
}


function isString(variable) {
	return toString.call(variable) == '[object String]';
}