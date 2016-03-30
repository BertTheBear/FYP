//id of extension
var myid = chrome.runtime.id;

//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;

//picture types
//Closest thing to a static int I can get
var NOSUIT	  = -1;
var BLACKSUIT = 0;
var BLUESUIT  = 1;
var GREENSUIT = 3;
var REDSUIT	  = 4;
var GREYSUIT  = 5;

//For use in recommendations function
var startIndex = 0;

//File to read info from
var recListFile = '/src/other/recommendationList.json';
//Object storing info
var recObject;
//========== REMOVE THIS AFTER EDITION 1 =================
//For switching from single array to 2D array
var maxRecLength = 100;
//========================================================



























//Calls clearHistory when the extension is loaded
chrome.runtime.onStartup.addListener(function(){
	//retrieve the data from the JSON file on opening
	readFromFile(recListFile);
	//This puts it into the recObject object for use below


	//Clear last session history
	clearHistory();

	//Calls the other functions too.
	chrome.storage.sync.get({
		checkFrequency: 5,
		history: 		true,
		organiser: 		true,
		startupProcess: true,
		tempNotify: 	false
	}, function (items) {
		//First check schedule
		checkSchedule();

		//Convert from old format to new format
		convertFromStringFormat();

		//Check recommendations list
		sortRecommendations();

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
						notificationFunction(noteTitle, noteText, open_options, null, BLACKSUIT); //Black for cleared?
					}
				});
			});
		}

		//checks whether we have permission for notifications
		else if (items.notif) {
			notificationFunction(noteTitle, noteText, open_options, null, GREYSUIT);//Show grey for light notification
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

//Polymorphism for no destination var or type var
function notificationURL(notificationTitle, bodyText) {
	notificationURL(notificationTitle, bodyText, null, 0);
}
//Polymorphism for no type var
function notificationURL(notificationTitle, bodyText, destination) {
	notificationURL(notificationTitle, bodyText, destination, 0);
}
//influenced from http://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
function notificationURL(notificationTitle, bodyText, destination, type) {

	var iconImage = '/images/128.png'; //Default. When type == 0
	if (type == REDSUIT) {
		iconImage = '/images/128-red.png';
	}
	else if (type == BLUESUIT) {
		iconImage = '/images/128-blue.png';
	}
	else if (type == GREENSUIT) {
		iconImage = '/images/128-green.png';
	}
	else if (type == GREYSUIT) {
		iconImage = '/images/128-grey.png';
	}
	else if (type == NOSUIT) {
		//Whatever for no suit
	}


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

//Polymorphism for no "funcparam" var or type var
function notificationFunction(notificationTitle, bodyText, func) {
	notificationFunction(notificationTitle, bodyText, null, null, 0);
}
//Polymorphism for no type var
function notificationFunction(notificationTitle, bodyText, func, funcparam) {
	notificationFunction(notificationTitle, bodyText, func, funcparam, 0);
}
function notificationFunction(notificationTitle, bodyText, func, funcparam, type) {
	//Set the icon image
	var iconImage = '/images/128.png'; //Default. When type == 0
	if (type == REDSUIT) {
		iconImage = '/images/128-red.png';
	}
	else if (type == BLUESUIT) {
		iconImage = '/images/128-blue.png';
	}
	else if (type == GREENSUIT) {
		iconImage = '/images/128-green.png';
	}
	else if (type == GREYSUIT) {
		iconImage = '/images/128-grey.png';
	}
	else if (type == NOSUIT) {
		//Whatever for no suit
	}


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

		//Notify of the check for testing purposes
		console.log("Schedule was checked at " + now.getHours() + ":" + now.getMinutes())//++++++++++++++++++++++


		//Check time with each element of list
		var scheduleArray = items.schedule;
		//console.log(JSON.stringify(scheduleArray));//+++++++
		//console.log(scheduleArray.length + " length");//+++++
		for(var x = 0; x < scheduleArray.length; x++) {
			var currentItem = scheduleArray[x];
			var time = new Date(currentItem.time);
			//Get hours + minutes from schedule item
			var itemHour = time.getHours();
			var itemMinute = time.getMinutes();
			//Check values versus times
			if(itemHour <= now.getHours() && itemHour >= lastChecked.getHours()){
				//If hours correct check minutes
				if(itemMinute <= now.getMinutes() && itemMinute > lastChecked.getMinutes()){
					//If the time has passed send notification
					if(items.autoNotifications || currentItem.approved) {
						var destination = currentItem.url;
						destination = destination.toLowerCase();

						//set type based upon object type
						var notificationColour = 0;
						//Set the picture as green if it's approved
						if(currentItem.approved) {
							notificationColour = GREENSUIT;
						}
						//Set as blue if it's an automatic creation
						else {
							notificationColour = BLUESUIT;
						}
						
						//Get all tabs open in the window
						chrome.tabs.query({}, function (result) {
							var tempTime = time;
							var itemMinute = tempTime.getMinutes();
							var itemHour = tempTime.getHours();
							//If it found no results then the page is not open
							if(result == null) {
								console.log(destination + " not found in tabs. Function will open Tab.");
								//Appropriate function...
							}

							var tabToOpen;
							var current = false;
							//Check whether the website is already open.
							for (var index = 0; index < result.length && !current; index++) {
								//For ease of reading
								var item = result[index];
								//If this tab contains url to be opened
								if(item.url.includes(destination)) {
									//If tabToOpen has no value
									if(tabToOpen == null) {
										tabToOpen = item;
									}
									else if(item.currentWindow) {
										//Window is open. Ignore?
										//Notify?
										current = true;//?
										return;
									}
								}
							}

							//If tab was found in loop above
							if(tabToOpen != null) {
								//To prevent 12:7 etc.
								var itemMinuteText = "" + itemMinute;
								if (itemMinute < 10)
									itemMinuteText = "0" + itemMinuteText;
								var title = /*itemHour + ":" + itemMinuteText + */"Website reminder";
								var textContent = "Click here to open tab containing " + destination;
								//Switch to that tab when notification clicked
								notificationFunction(title, textContent, function() {
									//Switch to that tab
									chrome.tabs.update(tabToOpen.id, { active: true });
								}, null, notificationColour);
							}
							else { //Tab not found to be open
								//Open url in a new tab

								//Make sure the url works
								destination = makeURL(destination);

								//To prevent 12:7 etc.
								var itemMinuteText = "" + itemMinute;
								if (itemMinute < 10)
									itemMinuteText = "0" + itemMinuteText;
								var title = /*itemHour + ":" + itemMinuteText + */"Website reminder";
								var textContent = "Click here to open " + destination + " in a new tab.";
								//Show notification
								notificationURL(title, textContent, destination, notificationColour);
							}
							
						});
						
					}
				}
			}
		};
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





























//****************** MISCELLANEOUS FUNCTIONS *******************
function open_history_options() {
	chrome.tabs.create({ 'url': 'chrome://settings/clearBrowserData'});
}

function open_options() {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + myid });
}


function isString(variable) {
	return toString.call(variable) == '[object String]';
}

function convertFromStringFormat() {
	chrome.storage.sync.get(function(items) {
		var theArray = items.schedule;

		//Now process the array
		for(var i = 0; i < theArray.length; i++) {
			//Temp var for ease of reading
			var currentElement = theArray[i];
			if (isString(currentElement)) {
				//Create the new object to splice in
				var newItem = new Object();


				var index = currentElement.indexOf(":");

				//Get time info from the string
				var time = new Date(0);
				var hours = parseFloat(currentElement.substring(index-2, index)); //2 values before : character
				var minutes = parseFloat(currentElement.substring(index+1, index+3)); //2 values after : 
				//add times to new Date
				time.setMinutes(minutes);
				time.setHours(hours);

				//Set time (Date)
				newItem.time = time;

				//Set url (String)
				var brokenUp = currentElement.split(","); //element should be time,url,type
				var urlPart = brokenUp[1];
				newItem.url = urlPart;

				//set approved (Boolean)
				var type = brokenUp[2];
				if(type == "trlist-user") {
					newItem.approved = true;
				}
				else {
					newItem.approved = false;
				}


				//Splice into theArray
				var removed = theArray.splice(i, 1, newItem);

			}
			//Remove any errors in the list. If time is not an integer
			else if(!(currentElement.time === parseInt(currentElement.time, 10)) || currentElement == null) {
				//Remove from list
				var removed = theArray.splice(i, 1);
				console.log("Removed:"); //++++++
				console.log(removed);//++++++++++
			}
		}
		theArray = theArray.filter(function(n){ return n != undefined }); 
		chrome.storage.sync.set({
			schedule: theArray
		}, function() {
			//Nothing for now
		});
	});
}








































// ############################## PROCESSING #############################

function processHistory() {
	//array for individual sites
	var commonSites = []; //God I'm great at puns...

	//Get all settings and schedule
	chrome.storage.sync.get({
		ignoreQuery: 		true,
		history: 			true,
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

		//Default ignore list for stopping checking private details
		// get this from recObject
		var defaultBlacklist = recObject.defaultBlacklist;


		//Convert from old format to new format
		convertFromStringFormat();

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
						//and set as NOT a single page
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
				});



				//Remove elements of list below threshold or containing blacklist
				for(var index = 0; index < commonSites.length; index++) {
					if(commonSites[index].visitCount < items.visitThreshold) {
						console.log(commonSites[index].url + " removed due to low count (" + 
									commonSites[index].visitCount + "<" + items.visitThreshold + ")");//+++++++++++++++++++++++++++++
						var removed = commonSites.splice(index, 1);
						//remove from index because array is shorter
						index -= removed.length;
					}
					else {
						//Check user blacklist
						var blacklist = items.ignoreList.split(",");
						commonSites = checkBlacklist(commonSites, blacklist);
						//Check default blacklist (Defined at top of page)
						commonSites = checkBlacklist(commonSites, defaultBlacklist);
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

function checkBlacklist(list, blacklist) {
	//if empty
	if (blacklist.length == 1 && blacklist[0] == "") {
		//List is empty, do nothing (For now)
		return list;
	}
	else {
		//Also O(x^3) so need to look at
		//Check if they contain any keywords
		for(var i = 0; i < blacklist.length; i++) {
			list.forEach(function(item, index, array) {
				var url = item.url + "";
				if(url.toLowerCase().includes(blacklist[i].toLowerCase())) {
					var removed = list.splice(index, 1);
					console.log("Removed " + url + " due to limitations.");
					//remove from index because array is shorter
					index -= removed.length;
				}
				//++++++++++++++++++++++++++++++++++++
				else {
					// Do not remove
					//console.log("Did not remove " + url + " as it is not included in ");//++++
					//console.log(blacklist);//++++++++++
				}
			})
		}
		//Can't finish early because it needs to check everything
		return list;
	}
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
		}, function(historyItems) {
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

			//If no visits fall within range then stop
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
					addToSchedule(domainUrl, scheduleTime);
				}
			}
			else {
				var scheduleTime = new Date(averageTime + NZModification);//Important to add back on the change
				addToSchedule(domainUrl, scheduleTime);
			}
		});
	});
}

function processSinglePage(pageUrl) {
	chrome.storage.sync.get({
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
		autoCount: 			20,
		timeRounding: 		1,
		schedule: 			[],
		rejectedSchedule: 	[],
		rejectedThreshold: 	3
	}, function(items) {
		//First check if it has been rejected too many times
		for(var index = 0; index < items.rejectedSchedule.length; index++) {
			//If found in "reject pile"
			if(items.rejectedSchedule[index].url == url) {
				//if above threshold
				if(items.rejectedSchedule[index].count > threshold) {
					//don't save
					console.log("Prevented " + url + ". Above rejected threshold.");
					return;
				}
			}
		}




		//Then check if there's already an automatic entry of that url
		//Also check if we have reached the entry limit
		var entries = countAutoEntries(items.schedule);
		var index = findInSchedule(url, items.schedule);
		if (0 <= index) {
			//For ease of reading
			var scheduleItem = items.schedule[index];

			//get old time and find average with current time
			//Convert from seconds to Date object
			var oldTime = new Date(scheduleItem.time);
			//Then find average between that and time
			var averageTime = (oldTime.getTime() + time.getTime()) / 2;
			//Round time
			averageTime -= averageTime % (items.timeRounding * microsecondsPerMinute);
			console.log("Edited " + url + " from " + oldTime + " to " + time);

			//Change time to equal new time
			time = new Date(averageTime);
		}
		else if(entries > items.autoCount){
			console.log("Prevented " + url + ". Too many automatic entries in array");
			return; //End the function
		}
		else 
			console.log("Accepted " + url);

		//Create new object to add to schedule
		var scheduleItem = new Object();
		scheduleItem.time = time.getTime();
		scheduleItem.url = url;
		scheduleItem.approved = false;

		//add to schedule and save
		items.schedule.push(scheduleItem);

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
		var itemToCheck = schedule[i];
		if(itemToCheck.url == url && itemToCheck.approved == false)
			return i;
	}
	return -1;
}

function countAutoEntries(schedule) {
	//return the amount of entries in an theArray containing theString
	var entryCount = 0;
	for(var i = 0; i < schedule.length; i++) {
		//For ease of reading
		var itemToCheck = schedule[i];
		//Increase if the approved is not true
		if(itemToCheck.approved == false)
			entryCount++;
	}
	return entryCount;
}

/*
function arrayStringIncludesCount(theString, theArray) {
	//return the amount of entries in an theArray containing theString
	var entryCount = 0;
	for(var i = 0; i < theArray.length; i++) {
		var toCheck = theArray[i] + "";
		if(toCheck.includes(theString))
			entryCount++;
	}
	return entryCount;
}/**/


//Ensures all elements of an array are unique
function uniq(array) {

	var uniqueArray = [];
	array.forEach(function(item, index, array) {
		if(item == null) {
			console.log("Removed null value");
			return;
		}
		//Make sure there are no errors in saved data. Makes sure time is an int
		if(typeof item.time === "undefined") {
			//type error
			console.log("Type error with" + JSON.stringify(item)); //+++++++++++++++++++++++++++++++++++++++++++++++++++++
			return; //Skip
		}
		else if(!(item.time === parseInt(item.time, 10))) {
			//error
			console.log("Error with" + JSON.stringify(item)); //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			return; //Skip
		}

		//for sohrtening the array runtime
		var found = false;
		for(var i = 0; i < uniqueArray.length && !found; ) {
			//if the urls are the same it's found
			if(item.url == uniqueArray[i].url) {
				found = true;
			}
			else {
				i++;
			}
		}
		//Check a few other settings if it's found
		if(found) {
			//if this item is approved and the other item isn't
			if(!uniqueArray[i].approved) {
				uniqueArray[i] = item;
			}
			else if(!(item.time == uniqueArray[i].time)) {
				uniqueArray.push(item);
			}
		}
		else {
			uniqueArray.push(item);
			//console.log("Did not find " + JSON.stringify(item));//++++++++++++
		}
	});

	//Remove null entries
	uniqueArray = uniqueArray.filter(function(n){ return n != undefined }); 

	//return the array of unique entries
	return uniqueArray;
}

































//+++++++++++++++++++++ RECOMMENDATIONS ++++++++++++++++++++++++++++

//Sorts the lists of recommendations for the extension
function sortRecommendations() {
	//Get existing list
	// Must be retrieved locally due to size constraints
	chrome.storage.local.get({
		recommendations: []
	}, function(items){

		var found = false;
		var i = 0;

		//Get the automatic classifications and save them as an object (Automatically update each time)
		console.log(recObject);//++++++
		var automaticClassification = recObject.automaticClassification;

		//Get the recommendations from the object too.
		var recommendations = recObject.recommendations;

						//========= TO REMOVE OLD FORMAT =============
						if(items.recommendations.length > maxRecLength) {
							//Just switch in the whole array
							console.log("RESET THE WHOLE REC ARRAY");//+++++++++++++++++

							// empty existing array and enter all of the new objects into it.
							items.recommendations = [];

							//make the array into objects
							for(var i = 0; i < recommendations.length; i++) {
								//First element is the category name
								var thisCategory = recommendations[i][0]; 
								var categoryArray = [];

								//first element is just category name
								categoryArray[0] = recommendations[i][0]

								//in each category make the objects
								for(var j = 1; j < recommendations[i].length; j++) {
									var tempObject = new Object();
									tempObject.category = categoryArray[0];
									tempObject.accepted = false;
									tempObject.blocked = false;
									//set url as the contents of recommendations array
									tempObject.url = recommendations[i][j];

									categoryArray.push(tempObject);
									//push() not append() ...
								}

								//Now add array as element of recommendations array
								items.recommendations[i] = categoryArray;
							}
						}
						else {
						//============================================
		



		//iterate through the list and check all entries
		//Adds new entries and skips old entries

		//For each array within recommendations array (As it's a 2D array)
		for(var outerIndex = 0; outerIndex < recommendations.length; outerIndex++) {

			//index of the category in the existing array
			var existingIndex = outerIndex;

			//If the arrays are not the same size it means there has been a change
			if(recommendations.length != items.recommendations.length) {
				//Check whether the target element is the correct category
				//This should only happen if new categories are added
				var target = outerIndex;//initial guess

				//Make a loop that guesses the start based off of the existing location, and 
				// then moves up or down accordingly but within the limits of the array
				var missing = false;
				var found = false;

				//Loop
				while(target > 0 && target < items.recommendations.length && !found && !missing) {
					//for ease of reading
					var existingCategory = items.recommendations[target][0];//First element is the category name
					var fileCategory = recommendations[outerIndex][0]; //first element is category name in both

					if(existingCategory == fileCategory) {
						found = true;
					}
					//if category too low
					else if(existingCategory < fileCategory) {
						target++;
						//If stuck between two categories
						if(existingCategory > fileCategory) {
							//new category
							missing = true;
						}
					}
					//if category too high
					else /*if(existingCategory > fileCategory)*/ {
						target--;
					}
				}


				//if it was missing and needs to be added
				if(missing) {
					var newArray = new Array();
					//add in new array in that location
					items.recommendations.splice(target, 0, [newArray]);
				}
				//else if it went out of bounds
				else if(!found) {
					var newArray = new Array();
					if(target < 0) {
						//broke lower bound put new array as first element
						items.recommendations.splice(0, 0, [newArray]);
					}
					else {
						//broke the upper bond, and must be placed at the end
						items.recommendations.push([newArray]);
					}
				}

				existingIndex = target;
			}


			//Binary search the other array.
			var arrayToCheck = items.recommendations[existingIndex];

			//check each element of the array to see whether it's already in the array
			for(var innerIndex = 1; innerIndex < recommendations[outerIndex].length; innerIndex++) {
				
				//Start at 1 to skip the category string

				//For each element in animation index, search existing array for url
				var found = false
				var url = recommendations[outerIndex][innerIndex];
				var thisCategory = arrayToCheck[0]; //First element is name of category
				//Search for url inside range of category
				found = urlBinarySearch(url, arrayToCheck);

				//If not found
				if(found < 0) {
					//create object to add to array.
					var tempObject = new Object();
					tempObject.category = thisCategory;
					tempObject.accepted = false;
					tempObject.blocked = false;
					tempObject.url = url;

					//if not found add tempObject to array with new url using binary sort
					items.recommendations = addAlphabetically(tempObject, items.recommendations);
				}

			}

		}
						} //==================================== ALSO THIS (See above)

		//Save new array of recommendations
		//   also always save the automatic recommendations on start up
		//Must be stored locally due to size constraints
		chrome.storage.local.set({
			recommendations: 			items.recommendations,
			automaticClassification: 	automaticClassification
		}, function(){
			console.log("Saved: "); //+++++++++++++++++++++++++++++++
			console.log(items.recommendations);//++++++++++++++++++++
		});
	});
}

//basic binary search
// I worte ths by miselef :D
function urlBinarySearch(url, recommendationArray) {
	//define limits
	var upperLimit = recommendationArray.length - 1; //Because arrays start at 0, not 1
	var lowerLimit = 1; //Start at one to skip the category name string

	//find middle value
	var middle = Math.round((lowerLimit + upperLimit) / 2);


	//Divide and search until upperLimit is no longer greater than lowerLimit (Which means it's not found)
	while (lowerLimit <= upperLimit) {

		//If found return index
		if (recommendationArray[middle].url == url) {
			return middle;
		}//If smaller than middle, make middle - 1 the new upper limit
		else if(recommendationArray[middle].url > url) {
			upperLimit = middle - 1;
		}//If larger than middle, make middle + 1 the new lower limit
		else /*if(recommendationArray[middle].url < url)*/ {
			lowerLimit = middle + 1;
		}


		//Then find the new middle and start again
		middle = Math.round((lowerLimit + upperLimit) / 2);
	}
	//If not found
	return -1;

}

function addAlphabetically(object, recommendationArray) {
	//define limits
	var upperLimit = recommendationArray.length - 1; //Because arrays start at 0, not 1
	var lowerLimit = 1;


	//find middle value
	var middle = Math.round((lowerLimit + upperLimit) / 2);

	//extract url for comparisons
	var url = object.url;


	//Divide and search until upperLimit is no longer greater than lowerLimit (Which means it's not found)
	while (lowerLimit <= upperLimit) {

		//If found return array and display error
		if (recommendationArray[middle].url == url) {
			console.log("Error. Duplicate found");
			return recommendationArray;
		}//If smaller than middle, make middle - 1 the new upper limit
		else if(recommendationArray[middle].url > url) {
			upperLimit = middle - 1;
		}//If larger than middle, make middle + 1 the new lower limit
		else /*if(recommendationArray[middle].url < url)*/ {
			lowerLimit = middle + 1;
		}


		//Then find the new middle and start again
		middle = Math.round((lowerLimit + upperLimit) / 2);
	}

	//Put new object into "middle" location
	recommendationArray.splice(middle, 0, object);


	//return edited array
	return recommendationArray;
}

//Functions for reading from the JSON file
//From http://stackoverflow.com/questions/18366191/import-text-file-using-javascript

//Sends a request to read the file.
function readFromFile(textFile) {
	var xhr = new XMLHttpRequest;
	xhr.open('GET', textFile);//, false); //false makes the request synchronous
	//On reading the file etc. calls the function show
	xhr.onload = show;
	xhr.send();
}

//Puts the information into an object that can be used by the other functions
function show() {
	//Put all of the text into a string
	var allTheText = this.response;
	//make an object (Already defined globally) of the parsed string
	recObject = JSON.parse(allTheText);

	//Anything else?
	//Don't think so
}