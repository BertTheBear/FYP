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
	document.getElementById('bloh').addEventListener('click', checkSchedule);
	document.getElementById('bleh').addEventListener('click', clearHistory);

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
	processHistory();
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

function open_options() {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + myid });
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
					notificationURL("Item restored", removedItem + " has been restored.");
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








// ========================== TIME CHECKING FUNCTIONS =====================================
function checkSchedule() {
	//Get the current time
	var now = new Date();
	var microsecondsSinceLastInterval = microsecondsPerMinute * minutesPerInterval;
	var lastCheckedVal = (new Date).getTime() - microsecondsSinceLastInterval;
	var lastChecked = new Date(lastCheckedVal);

	//Get the schedule
	chrome.storage.sync.get({
		schedule: []
	}, function(items) {
		//Check time with each element of list
		items.schedule.forEach(function (item, index, array){
			//causes an error otherwise
			item = item + "";
			var index = item.indexOf(":");
			var itemHour = item.substring(index-2, index);		//2 values before : character
			var itemMinute = item.substring(index+1, index+3);	//2 values after  : character
			//Check values versus times
			if(itemHour <= now.getHours() && itemHour >= lastChecked.getHours()){
				//If hours correct check minutes
				if(itemMinute <= now.getMinutes() && itemMinute >= lastChecked.getMinutes()){
					//If the time has passed send notification
					var splitter = item.split(",");
					var destination = splitter[1];//second item in array
					destination = makeURL(destination);
					notificationURL(itemHour + ":" + itemMinute + " reminder", "Click here to open " + destination, destination);
				}
			}
		});
	});
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









// -------------------------------- CLEAR HISTORY FUNCTION -------------------------------

//Clears history if set and records new time
function clearHistory() {
	//Get options from storage.
	chrome.storage.sync.get({
		notification: true,
		clearhistory: false,
		historytimer: 0
	}, function(items) {
		//For notification. Only changes if the history is deleted. Otherwise default text.
		var noteTitle = "Automatic History Clear Failed";
		var noteText = "Due to your preference settings, your history has NOT been cleared.\nClick here for options.";
		//Check if user set to clear history
		if (items.clearhistory) {
			//Last user login time. History will be cleared from this date
			var lastLogin = items.historytimer;

			chrome.browsingData.settings(function(result) {
				//This causes errors so must be removed
				if(result.dataToRemove.hasOwnProperty('cacheStorage')) {
					delete result.dataToRemove.cacheStorage;
				}

				//Get the settings and put them into the remove function
				chrome.browsingData.remove({ since: lastLogin }, result.dataToRemove, function() {
					//Something once the history is cleared

					//Probably just notify for now
					noteTitle = "History Automatically Cleared";
					noteText = "Selected history from your last session has been cleared.\nClick here for options.";
					//checks whether we have permission for notifications
					if (items.notification) {
						notificationFunction(noteTitle, noteText, open_options);
					}
				});
			});
		}

		//checks whether we have permission for notifications
		else if (items.notification) {
			notificationFunction(noteTitle, noteText, open_options);
		}
	});


	//Save the current time
	var currentLogin = (new Date).getTime();
	chrome.storage.sync.set({
		historytimer: currentLogin
	}, function() {
		//Nothing for now.
	});
}/**/














// ############################## PROCESSING #############################

function processHistory() {
	//array for individual sites
	var commonSites = []; //God I'm great at puns...

	//Get all settings and schedule
	chrome.storage.sync.get({
		history: 			true,
		bookmarks: 			true,
		topsites: 			true,
		notification: 		true,
		organiser: 			true,
		recommender: 		true, //--
		visitThreshold: 	3,	
		pageVisitThreshold: 9, //--
		typedWeight: 		2, //--
		timeThreshold: 		28,	
		ignoreList: 		"",	
		clearhistory: 		false,
		schedule: 			[]		//For adding on changes
	}, function(items) {
		//Stop if we don't have permission
		if(items.history != true){
			return;
			//This will end the funtion prematurely
		} else if(items.organiser != true) {
			return;
		}

		var microsecondsPerDay = 1000 * 60 * 60 * 24;
		//Multiply 1 day by the amount of days set by user.
		var historyCutoff = (new Date).getTime() - (microsecondsPerDay * items.timeThreshold);

		// Access history and process results
		chrome.history.search({
				'text': '',				
				'startTime': historyCutoff
			},
			function(historyItems) {
				//For each item check if it reaches the threshold
				historyItems.forEach(function(item, index, array) {
					var visits = item.visitCount;
					//Add weighted typedCount but remove one from weight
					// 		to account for initial recording of visit
					visits += item.typedCount * (items.typedWeight - 1); 

					//If it's the id of the extension then it ignores it
					if (item.url.includes(myid)) {
						return;
					}
					if (item.url.includes("google")){
						return;
					}

					//For single pages with many visits
					else if(visits >= items.pageVisitThreshold) {
						item.visitCount = visits;
						//remove # from end
						var urltemp = item.url;
						var hashIndex = urltemp.indexOf('#');
						if(hashIndex > -1) {
							item.url = item.url.substring(0, hashIndex);
						}
						//remove ? from end
						var qmarkIndex = urltemp.indexOf('?'); //Easier than urltemp.endsWith("?")
						if(qmarkIndex == urltemp.length-1) {
							item.url = item.url.substring(0, qmarkIndex);
						}
						//Set object as a single page
						item.singlePage = true;
					}
					//else check just the domain
					else {
						item.url = getHostname(item.url);
						item.singlePage = false;
					}

					var found = false;
					//Check if the site/domain already exists in the list
					//This is O(X^2) so maybe look into better method
					for(var i = 0; found == false && i < commonSites.length; i++) {
						if(commonSites[i].url == item.url) {
							commonSites[i].visitCount += visits;
							found = true;
						}
					}
					//if not found add to list
					if(found == false) {
						commonSites.push(item);
					}

				
				})



				//Remove elements of list below threshold or containing blacklist
				for(var index = 0; index < commonSites.length; index++) {
					if(commonSites[index].visitCount < items.visitThreshold) {
						var removed = commonSites.splice(index, 1);
						//remove from index because array is shorter
						index -= removed.length;
					}
					else {
						var blacklist = items.ignoreList.split(",");
						//if empty
						if (blacklist.length == 1 && blacklist[0] == "") {
							//List is empty, do nothing (For now)
						}
						else {
							//Also O(x^3) so need to look at
							//Check if they contain any keywords
							for(var i = 0; i < blacklist.length; i++) {
								commonSites.forEach(function(item, index, array) {
									var url = item.url + "";
									if(url.toLowerCase().includes(blacklist[i].toLowerCase())) {
										var removed = commonSites.splice(index, 1);
										//remove from index because array is shorter
										index -= removed.length;
									}
								})
							}
							//Can't finish early because it needs to check everything
						}
					}
				}
				//Print list for checking
				printList(commonSites);//++++++++++++++++++++


				//Process this list for patterns
				commonSites.forEach(function(item, index, array) {
					//Single pages are treated differently to domains
					if(item.singlePage) {
						processSinglePage(item.url);
					}
					else {
						processDomain(item.url);
					}
				});
			});
		});

}




function getHostname(url) {
	//make object element. a represents anchor... not element name...
	var forProcessing = document.createElement("a");
	//make url into href for object
	forProcessing.href = url;
	//return hostname section
	return forProcessing.hostname;
	//===OTHER POSSIBILITIES===
	//For if it matches criteria such as Google or Amazon etc.
	//forProcessing.protocol; 	// => "http:"
	//forProcessing.host;	 	// => "example.com:3000"
	//forProcessing.hostname; 	// => "example.com"
	//forProcessing.port;	 	// => "3000"
	//forProcessing.pathname; 	// => "/pathname/"
	//forProcessing.hash;	 	// => "#hash"
	//forProcessing.search;	 	// => "?search=test"
};


function processDomain(domainUrl) {
	chrome.storage.sync.get({
		timeThreshold: 28,
		ignoreQuery: true,
		schedule: [],
		newZero: 4
	}, function(items) {
		//Multiply 1 day by the amount of days set by user.
		var historyCutoff = (new Date).getTime() - (microsecondsPerDay * items.timeThreshold);

		chrome.history.search( {
			'text': domainUrl,	//Gets all results with the same URL
			'startTime': historyCutoff
		}, function(historyItems){
			//to account for late night browsing (New Zero Modification)
			var NZModification = items.newZero * microsecondsPerHour;


			var timeSum = 0;
			var maxTime = 0;
			//Set first as min
			var minTime = (historyItems[0].lastVisitTime - NZModification) % microsecondsPerDay; //Gets as microseconds in that day


			//Process using last visited times for all pages
			historyItems.forEach(function (item, index, array) {
				//For simplicity it only counts hours
				var time = (item.lastVisitTime - NZModification) % microsecondsPerDay;



				console.log(item.url + " at " + ((time + NZModification)/microsecondsPerHour));
				

				//Get just the time of day from the date
				//May make this work by week instead at some point
				timeSum += (time % microsecondsPerDay);

				//Set new min and max if changed
				if(time < minTime) {
					minTime = time;
				} else if (time > maxTime) {
					maxTime = time;
				}
			});


			//Get average visit time
			var averageTime = timeSum / historyItems.length;


			var timeDeviation = 6; //(In hours) how far the min and max must be before it checks
			var skewnessThreshold = 2;

			//Check if it needs to be broken up further
			// if the min and max are more than X hours apart and the average is close to the middle
			//  then we'll split it up further.
			var difference = (maxTime - minTime) / microsecondsPerHour;
			if(difference > timeDeviation) {
				var lower = ((averageTime - minTime) / microsecondsPerHour) / difference;
				var upper = ((maxTime - averageTime) / microsecondsPerHour) / difference;
				var positiveSkew = lower / upper;
				var negativeSkew = upper / lower;


				console.log("positiveSkew: " + positiveSkew); //+++++++++++++++++++++++++++++++
				console.log("negativeSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++


				if(positiveSkew > skewnessThreshold) {
					console.log("Warning you're positively skewed!");
				}else if(negativeSkew > skewnessThreshold) {
					console.log("Warning you're negatively skewed!");
				}
				else {
					var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change
					//Probably set it to get the last average from last time too.

					addToSchedule(domainUrl, scheduleTime);
				}
			}
			else {
				var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change
				//Probably set it to get the last average from last time too.

				addToSchedule(domainUrl, scheduleTime);
			}
		});
	});
}

function processSinglePage(pageUrl) {
	chrome.history.getVisits({
		url: pageUrl
	}, function(results) {
		//to account for late night browsing
		var newZero = 4; //in hours
		var NZModification = newZero * microsecondsPerHour;


		var timeSum = 0;
		var maxTime = 0;
		//Set first as min
		var minTime = (results[0].visitTime - NZModification) % microsecondsPerDay; //Gets as microseconds in that day
		results.forEach(function(item, index, array){
			//For simplicity it only counts hours
			var time = (item.visitTime - NZModification) % microsecondsPerDay;

			//Get just the time of day from the date
			//May make this work by week instead at some point
			timeSum += (time % microsecondsPerDay);

			//Set new min and max if changed
			if(time < minTime){
				minTime = time;
			} else if (time > maxTime) {
				maxTime = time;
			}

		})
		//Get average visit time
		var averageTime = timeSum / results.length;


		var timeDeviation = 6; //(In hours) how far the min and max must be before it checks
		var skewnessThreshold = 2;

		//Check if it needs to be broken up further
		// if the min and max are more than X hours apart and the average is close to the middle
		//  then we'll split it up further.
		var difference = (maxTime - minTime) / microsecondsPerHour;
		if(difference > timeDeviation) {
			var lower = ((averageTime - minTime) / microsecondsPerHour) / difference;
			var upper = ((maxTime - averageTime) / microsecondsPerHour) / difference;
			var positiveSkew = lower / upper;
			var negativeSkew = upper / lower;



			if(positiveSkew > skewnessThreshold) {
				console.log("Warning you're positively skewed!");
			}else if(negativeSkew > skewnessThreshold) {
				console.log("Warning you're negatively skewed!");
			}
			else {
				var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change
				//Print time for testing
				console.log(scheduleTime.getHours() + ":" + scheduleTime.getMinutes() + " open " + pageUrl);//+++++++++++

				addToSchedule(pageUrl, scheduleTime);
			}
		}
		else {
			var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change


			//Print time for testing
			console.log(scheduleTime.getHours() + ":" + scheduleTime.getMinutes() + " open " + pageUrl);//+++++++++++

			addToSchedule(pageUrl, scheduleTime);
		}
	});
}

function addToSchedule(url, time) {
	chrome.storage.sync.get( {
		schedule: []
	}, function(items) {
		//To prevent 12:7
		var minutes = time.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;

		var timeText = time.getHours() + ":" + minutes;
		//Print time for testing
		console.log(time.getHours() + ":" + time.getMinutes() + " open " + url);//+++++++++++

		//add to schedule and save
		items.schedule.push(timeText + "," + url + ",trlist-auto");
		//Remove duplicates
		items.schedule = uniq(items.schedule);
		//Save updated array
		chrome.storage.sync.set({
			schedule: items.schedule
		}, function() {
			//Do nothing for now
		});
	});
}



















//++++++++++++++++++++++++++++++++++++++++++++++++++++++++ TESTING
function printList(list){ 
	var thing = document.getElementById('printHere');

	var ul = document.createElement('ul');
	//if empty
	if (list.length == 0) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode('No contents'));

		ul.appendChild(li);
	}

	for (var i = 0; i < list.length; ++i) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(list[i].url + " COUNT: " + list[i].visitCount));

		ul.appendChild(li);
	}
	thing.appendChild(ul);
}
