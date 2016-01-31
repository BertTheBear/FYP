//id of extension
var myid = chrome.runtime.id;


//How many minutes to wait
var minutesPerInterval = 5;
var microsecondsPerMinute = 1000 * 60;
//time to wait between schedule checks
var timeToWait = microsecondsPerMinute * minutesPerInterval;


//Calls clearHistory when the extension is loaded
chrome.runtime.onStartup.addListener(function(){
	clearHistory();
	//First check schedule
	checkSchedule();
	//Also initiates loop for checking schedule
	setInterval(checkSchedule, timeToWait);
});












// -------------------------------- CLEAR HISTORY FUNCTION -------------------------------

//Clears history if set and records new time
function clearHistory() {
	//Get options from storage.
	chrome.storage.sync.get({
		notif: true,
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
}/**/

function open_options() {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + myid });
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





















// ############################## PROCESSING #############################

function processHistory() {
	//array for individual sites
	var commonSites = []; //God I'm great at puns...

	//Get all settings and schedule
	chrome.storage.sync.get({
		history: true,
		bookmarks: true,
		topsites: true,
		notif: true,
		organise: true,
		visit: 3,
		weight: 2,
		timer: 28,
		ignored: "",
		schedule: []		//For adding on changes
	}, function(items) {
		//Stop if we don't have permission
		if(items.history != true){
			return;
			//This will end the funtion prematurely
		}

		var microsecondsPerDay = 1000 * 60 * 60 * 24;
		//Multiply 1 day by the amount of days set by user.
		var historyCutoff = (new Date).getTime() - (microsecondsPerDay * items.timer);

		// Track the number of callbacks from chrome.history.getVisits()
		// that we expect to get.	When it reaches zero, we have all results.
		var numRequestsOutstanding = 0;

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
					visits += item.typedCount * (items.weight - 1); 
					if(visits >= items.visit) {
						item.visitCount = visits;
						commonSites.push(item);
					}
					//else add the domain count
					else {
						var domain = getHostname(item.url);
						var found = false;
						//Check if the domain already exists in the list
						//This is O(X^2) so maybe look into better method
						for(var i = 0; !found && i < commonSites.length; i++) {
							if(commonSites[i].url == domain) {
								commonSites[i].visitCount += visits;
								found = true;
							}
						}
						//if not found add to list
						if(found = false) {
							item.url = domain;
							commonSites.push(item);
						}
					}
				})

				//Remove elements of list below threshold or containing blacklist
				commonSites.forEach(function(item, index, array) {
					if(item.visitCount < items.visit) {
						var removed = commonSites.splice(index, 1);
					}
					else {
						var blacklist = items.ignored.split(",");
						//if empty
						if (blacklist == 1 && blacklist[0] == "") {
							//Everything is good
						}
						else {
							//Also O(x^3) so need to look at
							//Check if they contain any keywords
							for(var i = 0; i < blacklist.length; i++) {
								commonSites.forEach(function(item, index, array) {
									var url = commonSites.url + "";
									if(url.toLowerCase().includes(blacklist[i].toLowerCase())) {
										var removed = commonSites.splice(index, 1);
									}
								})
							}
						}
					}
				})

				//Process this information for patterns
				//processCommonSites(commonSites);
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
	//forProcessing.protocol; // => "http:"
	//forProcessing.host;	 // => "example.com:3000"
	//forProcessing.hostname; // => "example.com"
	//forProcessing.port;	 // => "3000"
	//forProcessing.pathname; // => "/pathname/"
	//forProcessing.hash;	 // => "#hash"
	//forProcessing.search;	 // => "?search=test"
};
