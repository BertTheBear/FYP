//id of extension
var myid = chrome.runtime.id;


var historyPermission = true;
var timerSetting = 0;
//var notifPermission = true;


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

//On page load call functions
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('blah').addEventListener('click', notification);

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
});
//document.getElementById('blah').addEventListener('click', printThis("Done"));



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
};


//Ensures all elements of an array are unique
// inspired from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
function uniq(array) {
	var seen = {};
	return array.filter(function(item) {
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
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


// FOR TESTING +++++++++++++++++++++++++++++++++++++++++++++++
function printThis(thing) {
	var area = document.getElementById("printHere");
	var ul = document.createElement('ul');
	area.appendChild(ul);
	var li = document.createElement('li');
	li.appendChild(document.createTextNode(thing));
	ul.appendChild(li);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//influenced from http://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
function notification() {

	var notificationTitle = 'Notification title'; //Placeholder
	var destination = "http://www.google.com"; //Placeholder
	var bodyText = "Hey there! You've been notified!"; //Placeholder
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
			notification.onclick = function () {
				window.open(destination);
				//Whatever I want the notification to do	
			};
		}
	});
}