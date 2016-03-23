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
		//for ease of writing/reading
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
			var url = currentTab.url;


			var selected = false;
			var urlIndex = 0;
			var count = 0;
			//Loops through this until it finds a recommendation 
			while(!selected) {

				//Find the category containing the url starting from the previous index (Usually 0)
				urlIndex = searchForUrlCategory(url, recommendations, urlIndex);
				
				//Returns -1 if not found
				if(urlIndex < 0) {
					console.log("Got here!");//++++++++++++++++++++++
					//Try and automatically categorise
					urlIndex = guessCategory(url);
					if(urlIndex < 0) {
						//can't find anything, 
						console.log("Couldn't find anything for " + url);//+++++++++++++++++++++
						return;
					}
					else {
						//Finds the first result that has not yet been viewed or is current and returns it
						for(var i = 1; i <= recommendations[urlIndex].length && !selected; i++) {
							//Make sure it has not been blocked or accepted
							if(!(recommendations[urlIndex][i].accepted || recommendations[urlIndex][i].blocked)) {
								//Make sure it's not the current tab
								if(!url.includes(recommendations[i].url)) {
									selected = true;
									//Send array and item location to another function for printing
									displayRecommendation(recommendations, urlIndex, i);
								}
							}
						}
					}
				}
				//must be not accepted and not blocked
				else if(recommendations[urlIndex].accepted || recommendations[urlIndex].blocked) {
					//If accepted or blocked end the function
					return;
				}

				//Finds the first result that has not yet been viewed or is current and returns it
				for(var i = 1; i <= recommendations[urlIndex].length && !selected; i++) {
					console.log("Got here!");//++++++++++++++++++++++
					//Make sure it has not been blocked or accepted
					if(!(recommendations[urlIndex][i].accepted || recommendations[urlIndex][i].blocked)) {
						//Make sure it's not the current tab
						if(!url.includes(recommendations[urlIndex][i].url)) {
							selected = true;
							//Send array and item location to another function for printing
							displayRecommendation(recommendations, urlIndex, i);
						}
					}
				}
				if(count == 5 ) {
					selected = true;
				}
				count++;
			}/**/
			//Else do nothing?
			// Maybe do something else such as allow adding to a category?
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
function searchForUrlCategory(url, recommendationsArray, start) {
	//start is for trying again later for a different category.

	var recommendedUrl = "";
	//Search array for url
	for(var categoryIndex = start; categoryIndex < recommendationsArray.length; categoryIndex++) {
		//search each element of each category.
		// (Might switch this for a binary search later)
		for(var urlIndex = 1; urlIndex < recommendationsArray[categoryIndex].length; urlIndex++) {
			recommendedUrl = recommendationsArray[categoryIndex][urlIndex].url;
			if(url.includes(recommendedUrl)) {
				console.log("Returned " + categoryIndex);//+++++++++++++++++++++++
				return categoryIndex;
			}
		}
	}

	//If URL is not found
	return -1;
}


//Takes words from the url and tries to guess the category
function guessCategory(url) {
	//Switch these for the JSON file later
	var tagArray 			= [
								["cartoon", "anime", "comic", "manga", "animated"], 
	/*educationalTags   	=*/ ["learn", "pedia", "tutorial"], 
	/*emailTags   			=*/ ["mail"], 
	/*entertainmentNewsTags =*/ ["entertainment", ], 
	/*financeTags   		=*/ ["bank", "finance", "trade"], 
	/*gameTags   			=*/ ["game", "play", "arcade"], 
	/*leisureTags   		=*/ ["funny"], 
	/*literatureTags   		=*/ ["book", "library", "read"], 
	/*musicTags   			=*/ ["songs", "lyrics", "music", ], 
	/*newsTags   			=*/ ["news"], 
	/*searchEngineTags   	=*/ ["search"], 
	/*shoppingTags   		=*/ ["store", "direct", "buy"], 
	/*socialMediaTags   	=*/ [], 
	/*sportsTags   			=*/ ["sports", "league", "match", "balls"], 
	/*technologyTags   		=*/ ["tech", "soft"], 
	/*televisionTags   		=*/ ["tv", "show", "watch", "flix"], 
	/*travelTags  			=*/ ["hotel", "travel", "escape"], 
	/*videoTags    			=*/ ["tube", "video"], 
	/*workTags				=*/ []
							];


	//search each array
	for(var i = 0; i < tagArray.length; i++) {
		//check each element or tag
		for(var j = 0; j < tagArray[i].length; j++) {
			//If the url contains the tags
			if(url.includes(tagArray[i][j])) {
				//return the index of the category
				return i;
			}
		}
	}
	//if nothing is found return default
	return -1;				
}