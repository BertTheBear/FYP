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
	read(recListFile);
	displayAcceptedRecommendations(acceptedRecTableName);
	displayRejectedRecommendations(rejectedRecTableName);
	displayRejectedSchedule(rejectedScheduleTableName);
});



//From http://stackoverflow.com/questions/18366191/import-text-file-using-javascript
function read(textFile) {
	var xhr = new XMLHttpRequest;
	xhr.open('GET', textFile);
	xhr.onload = show;
	xhr.send();
}

function show() {
	var div = document.createElement('div');
	//Put all of the text into a string
	var allTheText = this.response;
	//make an object (Defined globally) of the parsed string
	recObject = JSON.parse(allTheText);

	var recommendations = recObject.recommendations;

	console.log(recommendations); //+++++++++++++++++++++++++
	//I think it works
	//+++++++++++++++++++++++++++++++++++++++
	chrome.storage.local.get({
			recommendations: []
		}, function(items){
			console.log(items); //+++++++++++++++++++++++++++++++
		});
}

//Show accepted in table
function displayAcceptedRecommendations(tableName) {

}

//Show rejected in table
function displayRejectedRecommendations(tableName) {

}


//Show rejected automatic schedule items in table
function displayRejectedSchedule(tableName) {

}