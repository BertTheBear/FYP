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


//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;


//On page load call functions
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('submitButton').addEventListener('click', function() {
		if(validateFormURL(listErrorID, urlID)) {
			addArrayItem();
		}
	});
	arrayToList();

	//Settings
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('reset').addEventListener('click', reset_options);

	//Process history on button click
	document.getElementById('processHistory').addEventListener('click', processHistory);



	//Set to checked by default at each page load
	document.getElementById('undoNotifications').checked = true;



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
	url.setAttribute('href', 'http://' + urlText);//---------------------- fix
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.appendChild(document.createTextNode(urlText));
	//Checks the document for the list table
	var list = document.getElementById(listID);
	//Makes a new line to be added to the list and sets the id
	var line = document.createElement('tr');
	line.setAttribute('id','item'+lastid);

	//Set type user/automatic
	//trlist-user => user set
	//trlist-auto => automatically set
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
			schedule.push(timeText + "," + urlText + ",trlist-user");
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
			var toCheck = array[i] + "";
			if(toCheck.includes(object)) {
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
		var allowUndo = document.getElementById('undoNotifications').checked;
		if (allowUndo) {
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
		}
	});
}/**/
function replaceInArray(array, object) {
	var pos = array.indexOf(object);
	if(pos == -1) {
		//More intensive search
		var found = false;
		for(var i = 0; i < array.length && !found; i++) {
			var toCheck = array[i] + "";
			if(toCheck.includes(object)) {
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










//++++++++++++++++++++++++++ SAVE SETTINGS +++++++++++++++++++++++++++++++++

// Saves options to chrome.storage
function save_options() {
	//retrieve the settings from the page
	var checkFrequency  = document.getElementById('checkFrequency').value;	//---
	if (checkFrequency < 1) //Default to 1 if they set it too low
		checkFrequency = 1;
	var timeRounding  	= document.getElementById('timeRounding').value;	//---
	if (timeRounding < 1) //Default to 1 if they set it too low
		timeRounding = 1;
	var newZero  		= document.getElementById('newZero').value;			//---
	var trackAfter  	= document.getElementById('trackAfter').value;			//---
	var trackBefore  	= document.getElementById('trackBefore').value;			//---
	var autoNotifications = document.getElementById('autoNotifications').checked;//---
	var autoCount  	= document.getElementById('autoCount').value;	//---

	//Save the settings to memory
	chrome.storage.sync.set({
		checkFrequency: 	checkFrequency,		//--
		timeRounding: 		timeRounding,		//--
		newZero: 			newZero,		//--
		trackAfter: 		trackAfter, //--
		trackBefore: 		trackBefore, //--
		autoNotifications: 	autoNotifications, //--
		autoCount: 			autoCount//-----
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
		checkFrequency: 	5,	//---
		timeRounding: 		1,	//---
		newZero: 			4,	//---
		trackAfter: 		"00:00", //--
		trackBefore: 		"23:59", //--
		autoNotifications: 	false, //---
		autoCount: 			20 //-----
	}, function(items) {
		
		document.getElementById('checkFrequency').value 		= items.checkFrequency;
		document.getElementById('timeRounding').value 			= items.timeRounding;
		document.getElementById('newZero').value 				= items.newZero;
		document.getElementById('trackAfter').value 			= items.trackAfter;
		document.getElementById('trackBefore').value 			= items.trackBefore;
		document.getElementById('autoNotifications').checked 	= items.autoNotifications;//--
		document.getElementById('autoCount').value 				= items.autoCount;
	});
}/**/

function reset_options() {
	//get currently selected settings
	
	var checkFrequency  = document.getElementById('checkFrequency').value;	//---
	var timeRounding  	= document.getElementById('timeRounding').value;	//---
	var newZero  		= document.getElementById('newZero').value;			//---
	var trackAfter  	= document.getElementById('trackAfter').value;			//---
	var trackBefore  	= document.getElementById('trackBefore').value;			//---
	var autoNotifications = document.getElementById('autoNotifications').checked;//--
	var autoCount  		= document.getElementById('autoCount').value;			//---
	
	//overwrite with default
	document.getElementById('checkFrequency').value 		= 5; //--
	document.getElementById('timeRounding').value 			= 1; //--
	document.getElementById('newZero').value 				= 4; //--
	document.getElementById('trackAfter').value 			= "00:00"; //--
	document.getElementById('trackBefore').value 			= "23:59"; //--
	document.getElementById('autoNotifications').checked 	= false;//--
	document.getElementById('autoCount').value 				= 20; //--

	// Update status to let user know options were reset.
	var status = document.getElementById('status');
	status.textContent = 'Options have been reset to default.';


	//Create an "undo" option for if it is accidentally clicked
	var a = document.createElement('a');
	a.href = '#';
	a.appendChild(document.createTextNode(" undo"));
	a.addEventListener('click', function() {
		//For when undo is called
		var status = document.getElementById('status');
		status.textContent = "";
		status.appendChild(document.createElement('br'));

		//restore settings
		document.getElementById('checkFrequency').value 		= checkFrequency;//--
		document.getElementById('timeRounding').value 			= timeRounding;	//--
		document.getElementById('newZero').value 				= newZero;		//--
		document.getElementById('trackAfter').value 			= trackAfter;	//--
		document.getElementById('trackBefore').value 			= trackBefore;	//--
		document.getElementById('autoNotifications').checked  	= autoNotifications;//--
		document.getElementById('autoCount').value 				= autoCount;		//--
	});
	status.appendChild(a);
}/**/





















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
		timeThreshold: 28,
		ignoreQuery: true,
		timeRounding: 1,
		newZero: 4,
		trackAfter: "00:00", 
		trackBefore: "23:59",
		timeDeviation: 6, 
		skewnessThreshold: 2
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
			var itemHour = items.trackAfter.substring(index-2, index);		//2 values before : character
			var itemMinute = items.trackAfter.substring(index+1, index+3);	//2 values after  : character
			var lowerLimit = itemHour + (itemMinute / 60);//Time as a double
			//Make modification
			lowerLimit -= items.newZero; //not NZModification because that's too big

			//then upper limit
			index = items.trackBefore.indexOf(":");
			itemHour = items.trackBefore.substring(index-2, index);	
			itemMinute = items.trackBefore.substring(index+1, index+3);
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
			console.log("Item count too low for " + domainUrl); //+++++++++++++++++
				return; // Exits function
			}


			//Get average visit time
			var averageTime = timeSum / itemCount;
			//Round to the preset number
			averageTime -= (averageTime % items.timeRounding);


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
				console.log("positiveSkew: " + positiveSkew); //+++++++++++++++++++++++++++++++
					//Split the results
				}else if(negativeSkew > items.skewnessThreshold) {
					console.log("Warning you're negatively skewed!");
				console.log("negativeSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
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
		ignoreQuery: true,
		timeRounding: 1,
		newZero: 4,
		trackAfter: "00:00", 
		trackBefore: "23:59",
		timeDeviation: 6, 
		skewnessThreshold: 2
	}, function(items) {
		chrome.history.getVisits({
			url: pageUrl
		}, function(results) {
			//to account for late night browsing
			var NZModification = items.newZero * microsecondsPerHour;


			//Process tracking times into a more easily manipulated format
			//lower limit first
			var index = items.trackAfter.indexOf(":");
			var itemHour = items.trackAfter.substring(index-2, index);		//2 values before : character
			var itemMinute = items.trackAfter.substring(index+1, index+3);	//2 values after  : character
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
			averageTime -= (averageTime % items.timeRounding);


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
				console.log("positiveSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
					//Split results further
				}else if(negativeSkew > items.skewnessThreshold) {
					console.log("Warning you're negatively skewed!");
				console.log("negativeSkew: " + negativeSkew); //+++++++++++++++++++++++++++++++
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
		autoCount: 20,
		schedule: []
	}, function(items) {
		//First check if there's already an automatic entry of that url
		//Also check if we have reached the entry limit
		var entries = arrayStringIncludesCount("trlist-auto", items.schedule);
		if(entries > items.autoCount || findInSchedule(url, items.schedule)) {
			console.log("Prevented " + url + "Too many entries or found in array");
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
			return true;
	}
	return false;
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