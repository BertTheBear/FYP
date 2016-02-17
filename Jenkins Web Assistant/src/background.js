//id of extension
var myid = chrome.runtime.id;

//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;



//Calls clearHistory when the extension is loaded
chrome.runtime.onStartup.addListener(function(){
	//Clear last session history
	clearHistory();

	chrome.storage.sync.get({
		checkFrequency: 5,
		history: 		true,
		organiser: 		true,
		startupProcess: true,
		tempNotify: 	false
	}, function (items) {
		//First check schedule
		checkSchedule();

		//if tempnotify was selected, reset it
		if(items.tempNotify) {
			chrome.storage.sync.set({
				tempNotify: 	false,
				notification: 	true
			});
		}


		if(items.startupProcess && items.history && items.organiser) {
			//If set in permissions, run organiser on startup
			processHistory();
		}



		//How often in microseconds it will check
		var checkTime = items.checkFrequency * microsecondsPerMinute;
		//Also initiates loop for checking schedule
		setInterval(checkSchedule, checkTime);
	});
	
});

















// -------------------------------- CLEAR HISTORY FUNCTION -------------------------------

//Clears history if set and records new time
function clearHistory() {
	//Get options from storage.
	chrome.storage.sync.get({
		notif: true,
		clearhistory: false,
		notClearedNotification: false,
		historytimer: 0
	}, function(items) {
		//For notification. Only changes if the history is deleted. Otherwise default text.
		var noteTitle = "Automatic History Clear Failed";
		var noteText = "Automatic history clear is not enabled.\nClick here to open the options page.";
		//Will not notify this way. Won't be saved either.
		items.notif = items.notClearedNotification;

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
					if (items.notif) {
						notificationFunction(noteTitle, noteText, open_options);
					}
				});
			});
		}

		//checks whether we have permission for notifications
		else if (items.notif) {
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














// +++++++++++++++++++++++++++++ NOTIFICATION FUNCTIONS +++++++++++++++++++++++++++++++++++

//Polymorphism for no "funcparam" var
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
}/**/














// ========================== TIME CHECKING FUNCTIONS =====================================
function checkSchedule() {

	//Get the schedule
	chrome.storage.sync.get({
		checkFrequency: 	5,
		autoNotifications: 	false,
		schedule: 			[]
	}, function(items) {
		//Get the current time
		var now = new Date();
		var microsecondsSinceLastInterval = microsecondsPerMinute * items.checkFrequency;
		var lastCheckedVal = (new Date).getTime() - microsecondsSinceLastInterval;
		var lastChecked = new Date(lastCheckedVal);


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


					if(items.autoNotifications || splitter[2] == "trlist-user") {
						var destination = splitter[1];//second item in array

						//Make sure the url works
						destination = makeURL(destination);

						//Check whether the website is already open.
						/*
						chrome.tabs.query({url: destination}, function (result) {
							//If it found no results then the page is not open
							if(result == null) {
								console.log(destination + " not found in tabs. Function will open Tab.")
								//Appropriate function...
							}
							//If it's open, the function will switch to the tab instead.
							else {
								//Use the tab ID of the first result
								var tabID = result[0].id;
								//Appropriate function using id to open tab
							}
						});
						*/
						//Check is not working
						notificationURL(itemHour + ":" + itemMinute + " reminder", "Click here to open " + destination, destination);
						
					}
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



























//****************** OPEN OPTION PAGES *******************
function open_history_options() {
	chrome.tabs.create({ 'url': 'chrome://settings/clearBrowserData'});
}

function open_options() {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + myid });
}

























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
		if (items.timeThreshold <= 0)
			historyCutoff = 0;

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
					else if(items.ignoreQuery && item.url.indexOf("#") > -1) {
						return; //ignore any query or hash entries
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
		timeThreshold: 		28,
		ignoreQuery: 		true,
		timeRounding: 		1,
		newZero: 			4,
		trackAfter: 		"00:00", 
		trackBefore: 		"23:59",
		timeDeviation: 		6, 
		skewnessThreshold: 	2
	}, function(items) {
		//Multiply 1 day by the amount of days set by user.
		var historyCutoff = (new Date).getTime() - (microsecondsPerDay * items.timeThreshold);
		if (items.timeThreshold <= 0)
			historyCutoff = 0;

		chrome.history.search( {
			'text': domainUrl,	//Gets all results with the same URL
			'startTime': historyCutoff
		}, function(historyItems){
			//to account for late night browsing (New Zero Modification)
			var NZModification = items.newZero * microsecondsPerHour;


			//Process tracking times into a more easily manipulated format
			//lower limit first
			var index = items.trackAfter.indexOf(":");
			var itemHour = parseInt(items.trackAfter.substring(index-2, index));		//2 values before : character
			var itemMinute = parseInt(items.trackAfter.substring(index+1, index+3));	//2 values after  : character
			var lowerLimit = itemHour + (itemMinute / 60);//Time as a double
			//Make modification
			lowerLimit -= items.newZero; //not NZModification because that's too big

			//then upper limit
			index = items.trackBefore.indexOf(":");
			itemHour = parseInt(items.trackBefore.substring(index-2, index));	
			itemMinute = parseInt(items.trackBefore.substring(index+1, index+3));
			var upperLimit = itemHour + (itemMinute / 60);//Time as a double
			//Make modification
			upperLimit -= items.newZero;



			var timeSum = 0;
			var maxTime = 0;
			//Set first as min
			var minTime = (historyItems[0].lastVisitTime - NZModification) % microsecondsPerDay; //Gets as microseconds in that day

			//for finding average
			var itemCount = 0;


			//Process using last visited times for all pages
			historyItems.forEach(function (item, index, array) {
				//For simplicity it only counts hours
				var time = (item.lastVisitTime - NZModification) % microsecondsPerDay;				

				var timeCheck = time / microsecondsPerHour;



				//Make sure the time it within the limits
				if((lowerLimit < timeCheck && timeCheck < upperLimit) || (lowerLimit > timeCheck && timeCheck > upperLimit)) {
					//Get just the time of day from the date
					//May make this work by week instead at some point
					timeSum += (time % microsecondsPerDay);
					itemCount++;

					//Set new min and max if changed
					if(time < minTime) {
						minTime = time;
					} else if (time > maxTime) {
						maxTime = time;
					}
				}
			});

			//If no visits fall within rang then stop
			if(itemCount <= 0) {
			console.log("Item count too low for " + domainUrl); //+++++++++++++++++
			console.log("Item count: " + itemCount); //+++++++++++++++++++++++++
				return; // Exits function
			}


			//Get average visit time
			var averageTime = timeSum / itemCount;
			//Round to the preset number
			averageTime -= (averageTime % (items.timeRounding * microsecondsPerMinute));


			//Check if it needs to be broken up further
			// if the min and max are more than X hours apart and the average is close to the middle
			//  then we'll split it up further.
			var difference = (maxTime - minTime) / microsecondsPerHour;
			if(difference > items.timeDeviation) {
				var lower = ((averageTime - minTime) / microsecondsPerHour) / difference;
				var upper = ((maxTime - averageTime) / microsecondsPerHour) / difference;
				var positiveSkew = lower / upper;
				var negativeSkew = upper / lower;


				if(positiveSkew > items.skewnessThreshold) {
					console.log("Warning you're positively skewed!");
				console.log(domainUrl + " positiveSkew: " + positiveSkew); //+++++++++++++++++++++++++++++++
					//Split the results
				}else if(negativeSkew > items.skewnessThreshold) {
					console.log("Warning you're negatively skewed!");
				console.log(domainUrl + " negativeSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
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
	chrome.storage.sync.get({
		ignoreQuery: 		true,
		timeRounding: 		1,
		newZero: 			4,
		trackAfter: 		"00:00", 
		trackBefore: 		"23:59",
		timeDeviation: 		6, 
		skewnessThreshold: 	2
	}, function(items) {
		chrome.history.getVisits({
			url: pageUrl
		}, function(results) {
			//to account for late night browsing
			var NZModification = items.newZero * microsecondsPerHour;


			//Process tracking times into a more easily manipulated format
			//lower limit first
			var index = items.trackAfter.indexOf(":");
			var itemHour = parseInt(items.trackAfter.substring(index-2, index));		//2 values before : character
			var itemMinute = parseInt(items.trackAfter.substring(index+1, index+3));	//2 values after  : character
			var lowerLimit = itemHour + (itemMinute / 60);//Time as a double
			//Make modification
			lowerLimit -= items.newZero; //not NZModification because that's too big

			//then upper limit
			index = items.trackBefore.indexOf(":");
			itemHour = parseInt(items.trackBefore.substring(index-2, index));	
			itemMinute = parseInt(items.trackBefore.substring(index+1, index+3));
			var upperLimit = itemHour + (itemMinute / 60);//Time as a double
			//Make modification
			upperLimit -= items.newZero;

			var timeSum = 0;
			var maxTime = 0;
			//Set first as min
			var minTime = (results[0].visitTime - NZModification) % microsecondsPerDay; //Gets as microseconds in that day

			var itemCount = 0;

			results.forEach(function(item, index, array){
				//For simplicity it only counts hours
				var time = (item.visitTime - NZModification) % microsecondsPerDay;

				var timeCheck = time / microsecondsPerDay;

				//Make sure the time it within the limits
				if((lowerLimit < timeCheck && timeCheck < upperLimit) || (lowerLimit > timeCheck && timeCheck > upperLimit)) {
					//Get just the time of day from the date
					//May make this work by week instead at some point
					timeSum += (time % microsecondsPerDay);
					itemCount++;

					//Set new min and max if changed
					if(time < minTime) {
						minTime = time;
					} else if (time > maxTime) {
						maxTime = time;
					}
				}

			});

			//If no visits fall within rang then stop
			if(itemCount <= 0) {
				return; // Exits function
			}

			//Get average visit time
			var averageTime = timeSum / itemCount;
			//Round to the preset number
			averageTime -= (averageTime % (items.timeRounding * microsecondsPerMinute));


			//Check if it needs to be broken up further
			// if the min and max are more than X hours apart and the average is close to the middle
			//  then we'll split it up further.
			var difference = (maxTime - minTime) / microsecondsPerHour;
			if(difference > items.timeDeviation) {
				var lower = ((averageTime - minTime) / microsecondsPerHour) / difference;
				var upper = ((maxTime - averageTime) / microsecondsPerHour) / difference;
				var positiveSkew = lower / upper;
				var negativeSkew = upper / lower;



				if(positiveSkew > items.skewnessThreshold) {
					console.log("Warning you're positively skewed!");
				console.log(pageUrl + " positiveSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
					//Split results further
				}else if(negativeSkew > items.skewnessThreshold) {
					console.log("Warning you're negatively skewed!");
				console.log(pageUrl + " negativeSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
				}
				else {
					var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change

					addToSchedule(pageUrl, scheduleTime);
				}
			}
			else {
				var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change

				addToSchedule(pageUrl, scheduleTime);
			}
		});
	});
}

function addToSchedule(url, time) {
	chrome.storage.sync.get( {
		autoCount: 		20,
		timeRounding: 	1,
		schedule: 		[]
	}, function(items) {
		//First check if there's already an automatic entry of that url
		//Also check if we have reached the entry limit
		var entries = arrayStringIncludesCount("trlist-auto", items.schedule);
		var index = findInSchedule(url, items.schedule)
		if (0 <= index) {
			//Extract time from items.schedule[findInSchedule(url, items.schedule)]
			var breaker = items.schedule[index].indexOf(":");
			var oldTime = parseInt(items.schedule[index].substring(index-2, index)) * microsecondsPerHour;		//2 values before : character
			oldTime += parseInt(items.schedule[index].substring(index+1, index+3)) * microsecondsPerMinute; 	//2 values after : character
			//Then find average between that and time
			var averageTime = (oldTime + time) / 2;
			//Round time
			averageTime -= averageTime % (items.timeRounding * microsecondsPerMinute);
			console.log("Edited " + url);

			//Change time to equal new time
			time = new Date(averageTime);
		}
		if(entries > items.autoCount){
			console.log("Prevented " + url + ". Too many automatic entries in array");
			return; //End the function
		}
		console.log("Accepted " + url);



		//To prevent 12:7
		var minutes = time.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;

		var timeText = time.getHours() + ":" + minutes;

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

function findInSchedule(url, schedule) {
	//Return whether the url has been found in schedule in auto
	for(var i = 0; i < schedule.length; i++) {
		var toCheck = schedule[i] + "";
		if(toCheck.includes(url + ",trlist-auto"))
			return i;
	}
	return -1;
}

function arrayStringIncludesCount(theString, theArray) {
	//return the amount of entries in an theArray containing theString
	var entryCount = 0;
	for(var i = 0; i < theArray.length; i++) {
		var toCheck = theArray[i] + "";
		if(toCheck.includes(theString))
			entryCount++;
	}
	return entryCount;
}