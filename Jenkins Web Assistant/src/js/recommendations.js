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
		rejectedSchedule: []
	}, function(items) {
		//Display the information in the tables
		displayRejectedSchedule(items.rejectedSchedule, rejectedScheduleTableName, 1/*rejectedThreshold*/);

		
		//Display the information in the tables
		displayAcceptedRecommendations(items.recommendations, acceptedRecTableName);
		displayRejectedRecommendations(items.recommendations, rejectedRecTableName);
	});
	
});
















//Show accepted in table
function displayAcceptedRecommendations(recommendations, tableName) {
	//Checks the document for the list table
	var list = document.getElementById(tableName);

	//for each category
	for(var i = 0; i < recommendations.length; i++) {
		//for each element in the category
		for(var j = 1; j < recommendations[i].length; j++) {
			//Faster to duplicate the code than do this with functions I think.
			//    Might change later. I'll see.
			var currentObject = recommendations[i][j];
			if(currentObject.accepted) {
				//Makes a new line to be added to the list and sets the id  
				var line = document.createElement('tr');
				line.setAttribute('class', 'trcheckbox');


				//Puts the text into the first element of the row
				var entry = document.createElement('td');
				entry.appendChild(document.createTextNode(recommendations[i][j].url));
				//entry.appendChild(url);
				entry.setAttribute('class', 'trlist-Entry');


				//Add remove button
				var removal = document.createElement('td');
				var removeButton = document.createElement('a');
				removeButton.appendChild(document.createTextNode("X"));
				removeButton.setAttribute('href', '#');
				removeButton.setAttribute('class', 'trlist-RemoveButton');
				removeButton.addEventListener('click', function() {
					//Removes the whole line if the X is clicked
					list.removeChild(line);
					//Modifies the object in the array
					currentObject.accepted = false;
					//currentObject.rejected = false;
				});
				removal.appendChild(removeButton);
				line.appendChild(entry);
				line.appendChild(removal);
				//Add line to list
				list.appendChild(line);
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
				//Makes a new line to be added to the list and sets the id  
				var line = document.createElement('tr');
				line.setAttribute('class', 'trcheckbox');


				//Puts the text into the first element of the row
				var entry = document.createElement('td');
				entry.appendChild(document.createTextNode(recommendations[i][j].url));
				//entry.appendChild(url);
				entry.setAttribute('class', 'trlist-Entry');


				//Add remove button
				var removal = document.createElement('td');
				var removeButton = document.createElement('a');
				removeButton.appendChild(document.createTextNode("X"));
				removeButton.setAttribute('href', '#');
				removeButton.setAttribute('class', 'trlist-RemoveButton');
				removeButton.addEventListener('click', function() {
					//Removes the whole line if the X is clicked
					list.removeChild(line);
					//Modifies the object in the array
					currentObject.blocked = false;
				});
				removal.appendChild(removeButton);
				line.appendChild(entry);
				line.appendChild(removal);
				//Add line to list
				list.appendChild(line);
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
			console.log(currentObject.count + " >= " + threshold);//+++++++++++++++++++++
			//Makes a new line to be added to the list and sets the id  
			var line = document.createElement('tr');
			line.setAttribute('class', 'trcheckbox');


			//Puts the text into the first element of the row
			var entry = document.createElement('td');
			entry.appendChild(document.createTextNode(rejectedSchedule[i].url));
			//entry.appendChild(url);
			entry.setAttribute('class', 'trlist-Entry');


			//Add remove button
			var removal = document.createElement('td');
			var removeButton = document.createElement('a');
			removeButton.appendChild(document.createTextNode("X"));
			removeButton.setAttribute('href', '#');
			removeButton.setAttribute('class', 'trlist-RemoveButton');
			removeButton.addEventListener('click', function() {
				//Removes the whole line if the X is clicked
				list.removeChild(line);
				//Removes the object from the array
				rejectedSchedule.splice(i, 1);
			});
			removal.appendChild(removeButton);
			line.appendChild(entry);
			line.appendChild(removal);
			//Add line to list
			list.appendChild(line);
		}
		else {
			console.log(currentObject.count + " < " + threshold);//+++++++++++++++++++++
		}
	}
}
