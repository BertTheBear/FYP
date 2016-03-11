//id of extension
var myid = chrome.runtime.id;

var backgroundPage = chrome.extension.getBackgroundPage();

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
		recommendations: []
	}, function(items) {
		//get current tab url
		chrome.tabs.query({ currentWindow: true }, function (result) {
			//Makes sure there are results
			if(result.length < 1) {
				//error
			}
			//Should scan through the current window to find the active tab.
			var currentTab = result[0];
			for(var i = 0; i < result.length; i++) { //Stops if previous entry was active
				if (result[i].active) {
					currentTab = result[i];
				}
			}
			var url = currentTab.url;

			var urlIndex = searchForUrl(url, items.recommendations);
			//Returns -1 if not found
			if(urlIndex < 0) {
				//End function in this situation
				return;
			}
			//must be not accepted and not blocked
			else if(items.recommendations[urlIndex].accepted || items.recommendations[urlIndex].blocked) {
				//If accepted or blocked end the function
				return;
			}
			var urlCategory = items.recommendations[urlIndex].category;

			//Find limits of category
			// May change to be more efficient later
			var categoryUpperIndex = categoryBinarySearch(urlCategory, items.recommendations, true);	//True means first index
			if(categoryUpperIndex == null) {
				//If there is an error then set upper as being the final index
				categoryUpperIndex = items.recommendations.length - 1;
			}
			var categoryLowerIndex = categoryBinarySearch(urlCategory, items.recommendations, false); 	//False means last index
			if(categoryLowerIndex == null) {
				//If there is an error then set upper as being the first index
				categoryLowerIndex = 0;
			}




			//Finds the first result that has not yet been viewed or is current and returns it
			var selected = false;
			console.log(categoryLowerIndex + " < " + categoryUpperIndex);
			for(var i = categoryLowerIndex; i <= categoryUpperIndex && !selected; i++) {
				//Make sure it has not been blocked or accepted
				if(!(items.recommendations[i].accepted || items.recommendations[i].blocked)) {
					//Make sure it's not the current tab
					if(url != items.recommendations[i].url) {
						selected = true;
						//Send array and item location to another function for printing
						displayRecommendation(items.recommendations, i);
					}
				}
			}
			//Else do nothing?
			// Maybe do something else such as allow adding to a category?
		});
	});
}





//Displays the recommendation in the table
function displayRecommendation(recommendationArray, index) {
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
	var urlText = recommendationArray[index].url; //Get url of recommendation
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
		recommendationArray[index].accepted = true;

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
		recommendationArray[index].blocked = true;

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
			}, 750);
		});
	});
	removalColumn.appendChild(removeButton);


	//Add elements to the table
	recTable.appendChild(urlColumn);
	recTable.appendChild(acceptionColumn);
	recTable.appendChild(removalColumn);
}





//Functionality functions. Used in previous functions simply for ease of reading/modification
function searchForUrl(url, recommendationsArray) {
	//Try to replace with something faster

	var recommendedUrl = "";
	//Search array for url
	for(var index = 0; index < recommendationsArray.length; index++) {
		recommendedUrl = recommendationsArray[index].url;
		if(url.includes(recommendedUrl))
			return index;
	}

	//If URL is not found
	return -1;
}

function categoryBinarySearch(category, recommendationArray, start) {
	//start is a boolean where true means find the first element of the category 
	// and false means find the last element

	var upperLimit = recommendationArray.length - 1;
	var lowerLimit = 0;

	//find middle value
	var middle = Math.round((lowerLimit + upperLimit) / 2);

	//Divide and search until upperLimit is no longer greater than lowerLimit (Which means it's not found)
	while (lowerLimit <= upperLimit) {

		//If found return index
		if (recommendationArray[middle].category == category) {
			return categoryEdgeSearch(category, recommendationArray, middle, start);
		}//If smaller than middle, make middle - 1 the new upper limit
		else if(recommendationArray[middle].category > category) {
			upperLimit = middle - 1;
		}//If larger than middle, make middle + 1 the new lower limit
		else /*if(recommendationArray[middle].category < category)*/ {
			lowerLimit = middle + 1;
		}


		//Then find the new middle and start again
		middle = Math.round((lowerLimit + upperLimit) / 2);
	}
	//If not found
	return -1;

}

function categoryEdgeSearch(category, recommendationArray, loc, start) {
	//start is a boolean where true means find the first element of the category 
	// and false means find the last element

	if(recommendationArray[loc].category != category) {
		//error
		return -1;
	}
	if(!start) {//Find category before
		//keep searching util you reach the item before
		for(var i = loc; i > 0; i--) {
			if(recommendationArray[i].category != category)
				return i+1;
		}
	}
	else {//Find the category after
		//keep searching util you reach the item after
		for(var i = loc; i < recommendationArray.length; i++) {
			if(recommendationArray[i].category != category)
				return i-1;
		}
	}
}