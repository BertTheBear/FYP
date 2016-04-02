
//picture types
var NOSUIT	  = -1
var BLACKSUIT = 0
var BLUESUIT  = 1
var GREENSUIT = 3
var REDUIT	  = 4
var GREYSUIT  = 5

//For listeners
var helpIconCount = 5;
var helpIconID = 'help';
var backgroundPage = chrome.extension.getBackgroundPage();



//set triggers 
document.addEventListener('DOMContentLoaded', function() {
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('reset').addEventListener('click', reset_options);
	document.getElementById('clearHistorySettings').addEventListener('click', chrome.extension.getBackgroundPage().open_history_options);	
	setHelpTips(helpIconCount);
});



// Saves options to chrome.storage
function save_options() {
	//retrieve the settings from the page
	//Permissions
	var historyPermission  	= document.getElementById('checkHistory').checked;
	//var bookmarksPermission = document.getElementById('checkBookmarks').checked;
	//var topsitesPermission 	= document.getElementById('checkTopSites').checked;
	var notifyPermission 	= document.getElementById('checkNotificions').checked;
	var organiserPermission = document.getElementById('checkOrganiser').checked;
	var recommendPermission = document.getElementById('checkRecommendations').checked;
	//Processing
	var visitSite		= document.getElementById('visitThresholdSite').value;
	if (visitSite < 1) //Default to 1 if they set it too low
		visitSite = 1;
	var timer  	 		= document.getElementById('timeThreshold').value;
	if (timer < 0) //Default to 0 if they set it too low
		timer = 0;
	var ignored  		= document.getElementById('blacklist').value;
	//History Clear
	var clearhistory = document.getElementById('checkClearHistory').checked;


	//Save the settings to memory
	chrome.storage.sync.set({
		history: 			historyPermission,
		//bookmarks: 			bookmarksPermission,
		//topsites: 			topsitesPermission,
		notification: 		notifyPermission,
		recommender: 		recommendPermission,
		organiser: 			organiserPermission,
		visitThreshold: 	visitSite,
		timeThreshold: 		timer,
		ignoreList: 		ignored,
		clearhistory: 		clearhistory,
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
		history: 			true,
		//bookmarks: 			true,
		topsites: 			true,
		notification: 		true,
		organiser: 			true,
		recommender: 		true,
		visitThreshold: 	3,	
		timeThreshold: 		28,	
		ignoreList: 		"",	
		clearhistory: 		false
	}, function(items) {
		//Permissions
		document.getElementById('checkHistory').checked 		= items.history;
		//document.getElementById('checkBookmarks').checked 		= items.bookmarks;
		//document.getElementById('checkTopSites').checked 		= items.topsites;
		document.getElementById('checkNotificions').checked 	= items.notification;
		document.getElementById('checkOrganiser').checked 		= items.organiser;
		document.getElementById('checkRecommendations').checked = items.recommender;
		//Processing
		document.getElementById('visitThresholdSite').value		= items.visitThreshold;
		document.getElementById('timeThreshold').value 			= items.timeThreshold;
		document.getElementById('blacklist').value 				= items.ignoreList;
		//History Clear
		document.getElementById('checkClearHistory').checked 	= items.clearhistory;
	});
}/**/





//For selecting box using entire row
// Taken from http://stackoverflow.com/questions/5833152/click-anywhere-on-a-table-row-and-it-will-check-the-checkbox-its-in
(function () {
    function rowClick(e) {
        // discard direct clicks on input elements
        if (e.target.nodeName === "INPUT") return;
        // get the first checkbox
        var checkbox = this.querySelector("input[type='checkbox']");
        if (checkbox) {
            // if it exists, toggle the checked property
            checkbox.checked = !checkbox.checked;
        }
    }
    // iterate through all rows and bind the event listener
    [].forEach.call(document.querySelectorAll("tr"), function (tr) {
        tr.addEventListener("click", rowClick);
    });
})();





function reset_options() {
	//get currently selected settings
	//Permissions
	var historyPermission  	= document.getElementById('checkHistory').checked;
	//var bookmarksPermission = document.getElementById('checkBookmarks').checked;
	//var topsitesPermission 	= document.getElementById('checkTopSites').checked;
	var notifyPermission 	= document.getElementById('checkNotificions').checked;
	var organiserPermission = document.getElementById('checkOrganiser').checked;
	var recommendPermission = document.getElementById('checkRecommendations').checked;
	//Processing
	var visitSite	= document.getElementById('visitThresholdSite').value;
	var timer  	 	= document.getElementById('timeThreshold').value;
	var ignored  	= document.getElementById('blacklist').value;
	//History Clear
	var clearhistory = document.getElementById('checkClearHistory').checked;

	//overwrite with default
	document.getElementById('checkHistory').checked 		= true;
	//document.getElementById('checkBookmarks').checked 		= true;
	document.getElementById('checkTopSites').checked 		= true;
	document.getElementById('checkNotificions').checked 	= true;
	document.getElementById('checkOrganiser').checked 		= true;

	document.getElementById('visitThresholdSite').value		= 3;
	document.getElementById('timeThreshold').value 			= 28;
	document.getElementById('blacklist').value 				= "";

	document.getElementById('checkClearHistory').checked 	= false; //default false

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
		document.getElementById('checkHistory').checked 		= historyPermission;
		//document.getElementById('checkBookmarks').checked 		= bookmarksPermission;
		//document.getElementById('checkTopSites').checked 		= topsitesPermission;
		document.getElementById('checkNotificions').checked 	= notifyPermission;
		document.getElementById('checkOrganiser').checked 		= organiserPermission;
		document.getElementById('checkRecommendations').checked = recommendPermission;

		document.getElementById('visitThresholdSite').value 	= visitSite;
		document.getElementById('timeThreshold').value 			= timer;
		document.getElementById('blacklist').value 				= ignored;

		document.getElementById('checkClearHistory').checked 	= clearhistory;
	});
	status.appendChild(a);
}/**/







//++++++++++++++++++ HELP TIPS +++++++++++++++++++++++++++++++++++++++++++

function setHelpTips(numberofIcons) {
	for(var i = 0; i < numberofIcons; i++) {
		//get the icon ID from the document
		var icon = document.getElementById('help' + i);

		//Set listeners
		setListener(icon);
	}
}


function setListener(icon) {
	icon.addEventListener("click", function() {
		//Show a grey popup with the information
		backgroundPage.notificationURL("Option Help", icon.title, null, GREYSUIT);
	});
}