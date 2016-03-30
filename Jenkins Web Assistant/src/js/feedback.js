//File to read info from
var recListFile = '/src/other/recommendationList.json';
//Object storing info
var recObject;

//table names
var acceptedRecTableName = "acceptedRecommendations";
var rejectedRecTableName = "rejectedRecommendations";
var rejectedScheduleTableName = "rejectedSchedule";


//Page load functions
document.addEventListener('DOMContentLoaded', function() {

	//Show recommendations from LOCAL storage
	chrome.storage.local.get({
		recommendations: [],
		rejectedSchedule: [],
		rejectedThreshold: 2
	}, function(items) {
		//Display the information in the tables
		displayRejectedSchedule(items.rejectedSchedule, rejectedScheduleTableName, items.rejectedThreshold);

		
		//Display the information in the tables
		displayAcceptedRecommendations(items.recommendations, acceptedRecTableName);
		displayRejectedRecommendations(items.recommendations, rejectedRecTableName);


	});
	
});










//Show accepted in table
function displayAcceptedRecommendations(recommendations, tableName) {

	//for each category
	for(var i = 0; i < recommendations.length; i++) {
		//for each element in the category
		for(var j = 1; j < recommendations[i].length; j++) {
			//Faster to duplicate the code than do this with functions I think.
			//    Might change later. I'll see.
			var currentObject = recommendations[i][j];
			if(currentObject.accepted) {
				//add to the list
				addListItem(recommendations, currentObject, tableName);
			}
		}
	}
}

//Show rejected in table
function displayRejectedRecommendations(recommendations, tableName) {
	//Checks the document for the list table
	var list = document.getElementById(tableName);

	//for each category
	for(var i = 0; i < recommendations.length; i++) {
		//for each element in the category
		for(var j = 1; j < recommendations[i].length; j++) {
			//Faster to duplicate the code than do this with functions I think.
			//    Might change later. I'll see.
			var currentObject = recommendations[i][j];
			if(currentObject.blocked) {
				//add to the list
				addListItem(recommendations, currentObject, tableName);
			}
		}
	}
}


//Show rejected automatic schedule items in table
function displayRejectedSchedule(rejectedSchedule, tableName, threshold) {
	//Checks the document for the list table
	var list = document.getElementById(tableName);

	//for each category
	for(var i = 0; i < rejectedSchedule.length; i++) {
		//Faster to duplicate the code than do this with functions I think.
		//    Might change later. I'll see.
		var currentObject = rejectedSchedule[i];
		if(currentObject.count >= threshold) {
			//add to the list
			addListItem(rejectedSchedule, currentObject, tableName);
		}
	}
}


//Add object to list.
// This is because there was a problem when this was simply done within the for loop above
function addListItem(array, currentObject, tableName) {
	//Set the list
	var list = document.getElementById(tableName);


	//Makes a new line to be added to the list and sets the id  
	var line = document.createElement('tr');
	line.setAttribute('class', 'trcheckbox');


	//Puts the category into the first element of the row
	var categoryEntry = document.createElement('td');
	categoryEntry.appendChild(document.createTextNode(currentObject.category));
	categoryEntry.setAttribute('class', 'category-column');


	//Puts the url into the second element of the row
	var urlEntry = document.createElement('td');
	var url = document.createElement('a');
	url.setAttribute('href', makeURL(currentObject.url));
	url.setAttribute('target', '_blank'); //So it will open in a new tab/window and not break if the user tries to do this differently
	url.appendChild(document.createTextNode(currentObject.url)); //So that we can SEE the anchor...
	urlEntry.appendChild(url);
	urlEntry.setAttribute('class', 'trlist-Entry');


	//Add remove button
	var removal = document.createElement('td');
	var removeButton = document.createElement('a');
	removeButton.appendChild(document.createTextNode("X"));
	removeButton.setAttribute('href', '#');
	removeButton.setAttribute('class', 'trlist-RemoveButton');
	removeButton.addEventListener('click', function() {
		//Removes the whole line if the X is clicked
		list.removeChild(line);
		//does something different depending on table

		//If the schedule table do this
		if(tableName == rejectedScheduleTableName) {
			var location = array.indexOf(currentObject);
			if (location >= 0) {
				//Means that the element was found and no errors occured
				array.splice(location, 1);
			}
			else {
				//element not found. Abort!
				chrome.extension.getBackgroundPage().notificationURL("Error", "Unable to remove entry \"" + url + "\". Please notify Mikey.", null, REDSUIT);

			}
						
			//Save the arrays
			chrome.storage.local.set({
				rejectedSchedule: array
			}, function(){
				//Saved!
			})
		}
		//Else it's one of the recommendation tables
		else if (tableName == acceptedRecTableName || tableName == rejectedRecTableName) {
			//Just set both variables to false because they should never both be true anyway
			currentObject.accepted = false;
			currentObject.blocked = false;

			//Save the arrays
			chrome.storage.local.set({
				recommendations: array
			}, function(){
				//Saved!
			})
		}
	});
	removal.appendChild(removeButton);


	//add all of the columns to the line
	//Only if not Rejcected Schedule
	if(tableName != rejectedScheduleTableName) {
		line.appendChild(categoryEntry);
	}
	line.appendChild(urlEntry);
	line.appendChild(removal);


	//Add line to list
	list.appendChild(line);
}






































//++++++++++++++ MAKE URL <3 this function ++++++++++++++++++

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