//id of extension
var myid = chrome.runtime.id;

var backgroundPage = chrome.extension.getBackgroundPage();

//picture types
var NOSUIT	  = -1
var BLACKSUIT = 0
var BLUESUIT  = 1
var GREENSUIT = 3
var REDUIT	  = 4
var GREYSUIT  = 5

//Ids and class names
var recommendationTable = "recommendation";
var recommendationTitle = "recTitle";
var urlColumnClass = "popup-recommendation";
var notificationDiv = "notificationDiv";



//Microsecond amounts
var microsecondsPerMinute = 1000 * 60;
var microsecondsPerHour = 1000 * 60 * 60;
var microsecondsPerDay = 1000 * 60 * 60 * 24;
var patternCheckFrequency = 5;


//The index of the music category. Just for audible tabs
var MUSIC_CATEGORY = 8;




//################ For temp no notify ###################
//set triggers 
document.addEventListener('DOMContentLoaded', function() {
	restore_checkbox();
	document.getElementById('checkTempNotify').addEventListener('click', save_options);
	document.getElementById('opts').addEventListener('click', chrome.extension.getBackgroundPage().open_options);

	//Show recommendation table
	showRecommendation();


	//Check all tabs
	checkTabs();
});

function restore_checkbox() {
	chrome.storage.sync.get({
		tempNotify: 	false,
		notification: 	true
	}, function(items){
		//If notifications not allowed, hide the checkbox
		var rowToHide = document.getElementById('hideable');
		if(!items.notification && !items.tempNotify) {
			rowToHide.style.display = 'none';
		}
		else {
			rowToHide.style.display = 'initial';
			document.getElementById('checkTempNotify').checked 		= items.tempNotify;
		}
	});
}
function save_options() {
	var tempNotify = document.getElementById('checkTempNotify').checked;
	var newNotification = !tempNotify;

	//Save the settings to memory
	chrome.storage.sync.set({
		tempNotify: 	tempNotify,
		notification: 	newNotification
	});
}





//+++++++++++++++++ RECOMMENDATION +++++++++++++++++++++++++++++

//Shows the recommendation in the popup window
function showRecommendation() {
	chrome.storage.local.get({
		recommendations: 			[],
		automaticClassification: 	[]
	}, function(items) {
		//For ease of reading/writing
		var recommendations = items.recommendations;

		//get current tab url
		chrome.tabs.query({ currentWindow: true }, function (result) {
			//Makes sure there are results
			if(result.length < 1) {
				//error
			}


			//Should scan through the current window to find the active tab.
			var currentTab = result[0];//Defaults to the first one
			for(var i = 1; i < result.length && !result[i-1].active; i++) { //Stops if previous entry was active
				if (result[i].active) {
					currentTab = result[i];
				}
			}

			//For testing the function
			//currentTab.url = "department of computer and information systems ul";
			//currentTab.title = "Games and stuff";


			var selected = false;
			var categoryIndex = -1;
			//Loops through this until it finds a recommendation 
			while(!selected) {

				//categorise the website starting from the previous recommendation
				categoryIndex = categoriseTab(currentTab, items, categoryIndex);
				
				if(categoryIndex >= 0) {

					//Finds the first result that has not yet been viewed or is current and returns it
					for(var i = 1; i <= recommendations[categoryIndex].length && !selected; i++) {

						//Make sure it has not been blocked or accepted
						if(!(recommendations[categoryIndex][i].accepted || recommendations[categoryIndex][i].blocked)) {

							//Make sure it's not the current tab
							if(!currentTab.url.includes(recommendations[categoryIndex][i].url)) {

								//Send array and item location to another function for printing
								displayRecommendation(recommendations, categoryIndex, i);

								//Then stop looping through
								selected = true;
							}
						}
					}
				}
				else {
					//No category was found, end function
					console.log("Couldn't find anything for " + currentTab.url);//+++++++++++++++++++++
					return;
				}
			}
		});
	});
}





//Displays the recommendation in the table
function displayRecommendation(recommendationArray, categoryIndex, urlIndex) {
	//Get table in document
	var recTable = document.getElementById(recommendationTable);
	var recTitle = document.getElementById(recommendationTitle);

	//Add title
	var title = document.createElement("h2");
	title.appendChild(document.createTextNode("Possible Site Recommendations"));
	recTitle.appendChild(title);

	//Add column to table row
	//Makes a new line to be added to the recTable and sets the id
	var urlColumn = document.createElement('td');
	urlColumn.setAttribute('class', urlColumnClass);


	//Make the url a working anchor
	var url = document.createElement("a");
	var urlText = recommendationArray[categoryIndex][urlIndex].url; //Get url of recommendation from the index
	url.setAttribute('href', backgroundPage.makeURL(urlText));
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.setAttribute('class', 'popup-url');
	url.appendChild(document.createTextNode(urlText));
	//Adds URL to column
	urlColumn.appendChild(url);

	//Add accept button
	var acceptionColumn = document.createElement('td');
	var acceptButton = document.createElement('a');
	acceptButton.appendChild(document.createTextNode("Accept"));
	acceptButton.setAttribute('href', '#');
	acceptButton.setAttribute('class', 'trlist-AcceptButton');
	acceptButton.addEventListener('click', function() {
		//Change the 'accepted' attribute in the array
		//Edit the object in the array and save 
		recommendationArray[categoryIndex][urlIndex].accepted = true;

		chrome.storage.local.set({
			recommendations: recommendationArray
		}, function() {
			//Display notification
			// Update notificationDiv to let user know options were saved.
			var display = document.getElementById(notificationDiv);
			display.textContent = 'Preference saved.';
			setTimeout(function() {
				display.textContent = "";
				display.appendChild(document.createElement('br'));
				//reload window after delay
				window.location.reload();
			}, 750);
		});
	});
	acceptionColumn.appendChild(acceptButton);

	//Add reject button
	var removalColumn = document.createElement('td');
	var removeButton = document.createElement('a');
	removeButton.appendChild(document.createTextNode("X"));
	removeButton.setAttribute('href', '#');
	removeButton.setAttribute('class', 'trlist-RemoveButton');
	removeButton.addEventListener('click', function() {
		//Change the 'blocked' attribute in the array
		//Edit the object in the array and save 
		recommendationArray[categoryIndex][urlIndex].blocked = true;

		chrome.storage.local.set({
			recommendations: recommendationArray
		}, function() {
			//Display notification
			// Update notificationDiv to let user know options were saved.
			var display = document.getElementById(notificationDiv);
			display.textContent = 'Preference saved.';
			setTimeout(function() {
				display.textContent = "";
				display.appendChild(document.createElement('br'));
				//reload window after delay
				window.location.reload();
			}, 750);
		});
	});
	removalColumn.appendChild(removeButton);

	


	//Add elements to the table
	recTable.appendChild(urlColumn);
	recTable.appendChild(acceptionColumn);
	recTable.appendChild(removalColumn);
}




function categoriseTab(tab, items, previousCategory) {
	//For ease of reading and writing etc.
	var recommendations = items.recommendations;
	var tags = items.automaticClassification;
	var url = tab.url;
	var title = tab.title;

	var categoryIndex = -1

	//Find the category containing the url starting from just after the previous index (Usually 0 or (-1)+1)
	categoryIndex = searchForUrlCategory(url, recommendations, previousCategory);
	
	//Returns -1 if not found
	if(categoryIndex < 0) {
		//Try and automatically categorise using url
		categoryIndex = guessCategory(url, tags, previousCategory);
	}
	//If still not found
	if(categoryIndex < 0) {
		//can't find anything in url. Try title
		categoryIndex = guessCategory(title, tags, previousCategory);
	}
	//If it's playing sound it might be music???
	if(categoryIndex < 0 && tab.audible) {
		categoryIndex = MUSIC_CATEGORY;
	}
	//If none of these work try meta tags
	if(categoryIndex < 0) {
		chrome.tabs.sendMessage(tab.id, {text: 'get_meta_tags'}, checkMetaTags);
	}

	return categoryIndex;
}


//Functionality functions. Used in previous functions simply for ease of reading/modification
function searchForUrlCategory(url, recommendationsArray, previousCategory) {
	//previousCategory is for trying again later for a different category.

	//Search array for url
	for(var returnIndex = previousCategory + 1; returnIndex < recommendationsArray.length; returnIndex++) {
		//search each element of each category.
		// (Might switch this for a binary search later)
		for(var urlIndex = 1; urlIndex < recommendationsArray[returnIndex].length; urlIndex++) {
			var recommendedUrl = recommendationsArray[returnIndex][urlIndex].url;
			if(url.includes(recommendedUrl)) {
				return returnIndex;
			}
		}
	}

	//If URL is not found
	return -1;
}


//Takes words from the url or title and tries to guess the category
function guessCategory(tabInfo, tagArray, previousCategory) {
	//previousCategory is for trying again later for a different category.

	//make lower case
	tabInfo = tabInfo.toLowerCase();
	
	//search each array, previousCategorying AFTER the previous
	for(var returnIndex = previousCategory + 1; returnIndex < tagArray.length; returnIndex++) {
		//check each element or tag
		for(var tagIndex = 0; tagIndex < tagArray[returnIndex].length; tagIndex++) {
			var tag = tagArray[returnIndex][tagIndex];
			//If the tabInfo contains the tags
			if(tabInfo.includes(tag)) {
				//return the index of the category
				return returnIndex;
			}
		}
	}
	//if nothing is found return default
	return -1;
}


function checkMetaTags(metaTags) {
	//First, in case of errors
	if(metaTags == null) {
		//error
		return;
	}

	//Testing
	console.log(metaTags);//++++++++++++++++++++

}

























// ########################### RECORD PATTERN #############################

/*
	At the moment this triggers whenever the popup is opened.
	I should probably set this to trigger whenever the use opens/closes a tab (But with the frequency check)
	The frequency check is simply to prevent too much of the SAME pattern from triggering with the check.

	I might make this able to be set but I'll leave it for now.
*/

function checkTabs() {
	//get necessary variables etc.

	chrome.storage.local.get({
		recommendations: 			[],
		automaticClassification: 	[],
		patternLastChecked: 		0,
		browsingPatterns: 			[]
	}, function(items) {
		var rightNow = Date.now();
		//Only check it it has been some time since the previous check
		if((rightNow - items.patternLastChecked) > (patternCheckFrequency * microsecondsPerMinute)) {
			//Change when last checked
			items.patternLastChecked = rightNow;
			//get ALL tabs
			chrome.tabs.query({ }, function (result) {
				//to save results
				var tabArray = [];


				//Process tabs and record pattern (Alphabetically?)
				for(var tabIndex = 0; tabIndex < result.length; tabIndex++) {
					//For ease of reading/writing.thinking etc.
					var currentTab = result[tabIndex];
					var categoryIndex = -1;//Initialising as -1 prevents errors when going to the same or lower category

					//Categorise using the same function as the recommendations
					categoryIndex = categoriseTab(currentTab, items, categoryIndex);
					//Print for testing
					console.log("Tab " + tabIndex + ", Category : " + categoryIndex); //++++++++++++++++++++++++++++++

					//Add elements to array
					tabArray.push(categoryIndex);
				}

				//Sort the array
				tabArray.sort();

				//Add to patterns array as an object
				var pattern = new Object();
				pattern.pattern = tabArray;
				pattern.time = getNow();
				pattern.count = 1;



				//Check existing and save
				savePattern(pattern, items);
			});
		}
	});
}

function savePattern(tabs, items) {
	//For ease of reading/writing etc.
	var existingPatterns = items.browsingPatterns;
	var found = false;

	//Simplify the pattern into just 
	var simplified = removeDuplicates(tabs.pattern);

	//Scan through existing patterns to see if it exists
	for(var patternIndex = 0; !found && patternIndex < existingPatterns.length; patternIndex++) {
		var currentObject = existingPatterns[patternIndex];

		//See if patterns are equal OR if the pattern exists with different numbers of tabs
		if(equalArrays(tabs.pattern, currentObject.pattern) || equalArrays(simplified, currentObject.pattern)) {
			currentObject.count += 1;
			found = true;
			//Also change the average time
			// Multiply the existing time by previous count, add on new time and divide by new count
			currentObject.time = ((currentObject.time * (currentObject.count - 1)) + getNow()) / currentObject.count;
		}

		//else keep looping
	}

	//If not found, add to the array
	if(!found) {
		existingPatterns.push(tabs);
		//Also save simplified version?
	}

	//Then save the changed existing patterns array
	// and also the last checked value
	chrome.storage.local.set({
		browsingPatterns: 	existingPatterns,
		patternLastChecked: items.patternLastChecked
	}, function() {
		//Successfully saved
	})


}

//Ensures all elements of an array are unique
// inspired from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
function removeDuplicates(array) {
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


//Compares two arrays
// inspired by http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
function equalArrays(arrayOne, arrayTwo) {
	// compare lengths - can save a lot of time 
	if (arrayOne.length != arrayTwo.length)
		return false;

	for (var i = 0; i < arrayOne.length; i++) {
		// Check if we have nested arrays
		if (arrayOne[i] instanceof Array && arrayTwo[i] instanceof Array) {
			// recurse into the nested arrays
			if (!arrayOne[i].equals(arrayTwo[i]))
				return false;
		}
		else if (arrayOne[i] != arrayTwo[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
}

//for finding the current time as milliseconds in the day (rounded to the nearest minute)
function getNow() {
	//Get current time in milliseconds since epoch
	var time = Date.now();

	time = time % microsecondsPerDay;
	time -= time % microsecondsPerMinute

	return time;
}