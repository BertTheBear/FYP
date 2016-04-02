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
	//If those don't work try meta tags

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
















// ########################### RECORD PATTERN #############################

function checkTabs() {
	//get necessary variables etc.

	chrome.storage.local.get({
		recommendations: 			[],
		automaticClassification: 	[]
	}, function(items) {
		//get ALL tabs
		chrome.tabs.query({ }, function (result) {
			//Process tabs and record pattern (Alphabetically?)
			for(var tabIndex = 0; tabIndex < result.length; tabIndex++) {
				//For ease of reading/writing.thinking etc.
				var currentTab = result[tabIndex];
				var categoryIndex = -1;//Initialising as -1 prevents errors when going to a lower category

				//Categorise using the same function as the recommendations
				categoryIndex = categoriseTab(currentTab, items, categoryIndex);
				console.log("Tab " + tabIndex + ", Category : " + categoryIndex); //++++++++++++++++++++++++++++++
			}
		});
	});
}