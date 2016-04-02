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
	document.getElementById('check').addEventListener('click', function(){
		//chrome.extension.getBackgroundPage().checkSchedule();
		thing();
	});
	document.getElementById('populate').addEventListener('click', function(){
		populate();
	});
	document.getElementById('sync').addEventListener('click', function(){
		chrome.storage.sync.clear();
	});
	document.getElementById('local').addEventListener('click', function(){
		chrome.storage.local.clear();		
	});

	//check for permission for notifications
	if (Notification.permission !== "granted")
		Notification.requestPermission();

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




function populate() {
	//One minute in microseconds
	var oneMinute = 1000 * 60;
	var oneHour = oneMinute * 60;	//Daylight savings is being annoying
	var twentyFourHours = oneHour * 24;

	//Now in just today's microseconds
	var now = (Date.now() % twentyFourHours);
	now = now - (now % oneMinute);

	//STUPID DAYLIGHT SAVINGS
	now = now + oneHour;


	//Get time rounder
	chrome.storage.sync.get({
		timeRounding: 1
	}, function(items) {
		//Set the times for the recommender
		var schedule = [];
		var round = items.timeRounding;
	//Just check
	console.log(round)//++++++++++++++++++++++++++
		var websites = ["rte.ie", "ul.ie", "www.csis.ul.ie", "rte.ie", "play.spotify.com", "bbc.com", "en.wikipedia.com", "rte.ie"];
		var index = 0;
		//For loop setting times
		for(var i = 0; i < 20; i = i + 3) {
			var timeToAdd = oneMinute * i;

			var item = new Object();
			item.url = websites[index];
			item.time = (now + timeToAdd) - ((now + timeToAdd) % (round * oneMinute));
			item.approved = false;
			if((i % 9) == 0) {
				item.approved = true;
			}

			//add item to array
			schedule.push(item);

			//increment index
			index++;
		}


		//Now save
		chrome.storage.sync.set({
			schedule: schedule
		}, function() {
			//Do nothing?
			console.log(schedule);//+++++++++++++++++++++
		})
	});


	chrome.storage.local.get({
		rejectedThreshold: 3
	}, function(items){
		amount = items.rejectedThreshold;

		var theArray = [];
		//Add to array
		var fox = new Object();
		fox.url = "foxnews.com";
		fox.count = amount * 2;

		hound = new Object();
		hound.url = "fb.com";
		hound.count = amount + 10;

		theArray.push(fox);
		theArray.push(hound);

		chrome.storage.local.set({
			rejectedSchedule: theArray
		}, function(){
			console.log(theArray);//++++++++++++++++++++
		})

	})
	

}