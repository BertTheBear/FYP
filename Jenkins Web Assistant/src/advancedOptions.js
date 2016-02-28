//set triggers 
document.addEventListener('DOMContentLoaded', function() {
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('reset').addEventListener('click', reset_options);
	document.getElementById('clearHistorySettings').addEventListener('click', chrome.extension.getBackgroundPage().open_history_options);	
});



// Saves options to chrome.storage
function save_options() {
	//retrieve the settings from the page
	//Permissions
	var historyPermission  	= document.getElementById('checkHistory').checked;
	//var bookmarksPermission = document.getElementById('checkBookmarks').checked;
	var topsitesPermission 	= document.getElementById('checkTopSites').checked;
	var notifyPermission 	= document.getElementById('checkNotificions').checked;
	var organiserPermission = document.getElementById('checkOrganiser').checked;
	var recommendPermission = document.getElementById('checkRecommendations').checked;//--
	//Processing
	var visitSite		= document.getElementById('visitThresholdSite').value;
	var visitPage 		= document.getElementById('visitThresholdPage').value; //--
	var weight 	 		= document.getElementById('typedWeight').value; //--
	var timer  	 		= document.getElementById('timeThreshold').value;
	var ignored  		= document.getElementById('blacklist').value;
	var checkFrequency  = document.getElementById('checkFrequency').value;	//---
	if (checkFrequency < 1) //Default to 1 if they set it too low
		checkFrequency = 1;
	var timeRounding  	= document.getElementById('timeRounding').value;	//---
	if (timeRounding < 1) //Default to 1 if they set it too low
		timeRounding = 1;
	var newZero  		= document.getElementById('newZero').value;			//---
	//Make sure "trackAfter" is the smaller value
	var trackAfter  	= document.getElementById('trackAfter').value;			//---
	var trackBefore  	= document.getElementById('trackBefore').value;			//---
	if(trackAfter > trackBefore) {
		var trackAfter  = document.getElementById('trackBefore').value;			//---
		var trackBefore = document.getElementById('trackAfter').value;			//---
	}
	var autoNotifications = document.getElementById('autoNotifications').checked;//---
	var autoCount  	= document.getElementById('autoCount').value;	//---
	//History Clear
	var clearhistory = document.getElementById('checkClearHistory').checked;
	var notClearedNotification = document.getElementById('notClearedNotification').checked;// ----

	//Save the settings to memory
	chrome.storage.sync.set({
		history: 			historyPermission,
		//bookmarks: 			bookmarksPermission,
		topsites: 			topsitesPermission,
		notification: 		notifyPermission,
		organiser: 			organiserPermission,
		recommender: 		recommendPermission,//--
		visitThreshold: 	visitSite,
		pageVisitThreshold: visitPage,			//--
		typedWeight: 		weight,				//--
		timeThreshold: 		timer,
		ignoreList: 		ignored,
		checkFrequency: 	checkFrequency,		//--
		timeRounding: 		timeRounding,		//--
		newZero: 			newZero,			//--
		trackAfter: 		trackAfter, 		//--
		trackBefore: 		trackBefore, 		//--
		autoNotifications: 	autoNotifications, //--
		autoCount: 			autoCount,			//-----
		clearhistory: 		clearhistory,
		notClearedNotification: notClearedNotification//---
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
		checkFrequency: 	5,	//---
		timeRounding: 		1,	//---
		newZero: 			4,	//---
		trackAfter: 		"00:00", //--
		trackBefore: 		"23:59", //--
		autoNotifications: 	false, //---
		autoCount: 			20, //-----
		clearhistory: 		false,
		notClearedNotification: false //---
	}, function(items) {
		//Permissions
		document.getElementById('checkHistory').checked 		= items.history;
		//document.getElementById('checkBookmarks').checked 		= items.bookmarks;
		document.getElementById('checkTopSites').checked 		= items.topsites;
		document.getElementById('checkNotificions').checked 	= items.notification;
		document.getElementById('checkOrganiser').checked 		= items.organiser;
		document.getElementById('checkRecommendations').checked = items.recommender;//--
		//Processing
		document.getElementById('visitThresholdSite').value		= items.visitThreshold;
		document.getElementById('visitThresholdPage').value		= items.pageVisitThreshold;//--
		document.getElementById('typedWeight').value 			= items.typedWeight;//--
		document.getElementById('timeThreshold').value 			= items.timeThreshold;
		document.getElementById('blacklist').value 				= items.ignoreList;
		document.getElementById('checkFrequency').value 		= items.checkFrequency;
		document.getElementById('timeRounding').value 			= items.timeRounding;
		document.getElementById('newZero').value 				= items.newZero;			//----
		document.getElementById('trackAfter').value 			= items.trackAfter;			//---
		document.getElementById('trackBefore').value 			= items.trackBefore;		//---
		document.getElementById('autoNotifications').checked 	= items.autoNotifications;//--
		document.getElementById('autoCount').value 				= items.autoCount;			//---
		//History Clear
		document.getElementById('checkClearHistory').checked 	= items.clearhistory;
		document.getElementById('notClearedNotification').checked 	= items.notClearedNotification; //---
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
	var topsitesPermission 	= document.getElementById('checkTopSites').checked;
	var notifyPermission 	= document.getElementById('checkNotificions').checked;
	var organiserPermission = document.getElementById('checkOrganiser').checked;
	var recommendPermission = document.getElementById('checkRecommendations').checked;//--
	//Processing
	var visitSite		= document.getElementById('visitThresholdSite').value;
	var visitPage 		= document.getElementById('visitThresholdPage').value; //--
	var weight 	 		= document.getElementById('typedWeight').value; //--
	var timer  	 		= document.getElementById('timeThreshold').value;
	var ignored  		= document.getElementById('blacklist').value;
	var checkFrequency  = document.getElementById('checkFrequency').value;	//---
	var timeRounding  	= document.getElementById('timeRounding').value;	//---
	var newZero  		= document.getElementById('newZero').value;			//---
	var trackAfter  	= document.getElementById('trackAfter').value;			//---
	var trackBefore  	= document.getElementById('trackBefore').value;			//---
	var autoNotifications = document.getElementById('autoNotifications').checked;//--
	var autoCount  		= document.getElementById('autoCount').value;			//---
	//History Clear
	var clearhistory = document.getElementById('checkClearHistory').checked;
	var notClearedNotification = document.getElementById('notClearedNotification').checked;

	//overwrite with default
	document.getElementById('checkHistory').checked 		= true;
	//document.getElementById('checkBookmarks').checked 		= true;
	document.getElementById('checkTopSites').checked 		= true;
	document.getElementById('checkNotificions').checked 	= true;
	document.getElementById('checkOrganiser').checked 		= true;
	document.getElementById('checkRecommendations').checked = true;//--

	document.getElementById('visitThresholdSite').value		= 3;
	document.getElementById('visitThresholdPage').value		= 9;//--
	document.getElementById('typedWeight').value 			= 2;//--
	document.getElementById('timeThreshold').value 			= 28;
	document.getElementById('blacklist').value 				= "";
	document.getElementById('checkFrequency').value 		= 5; //--
	document.getElementById('timeRounding').value 			= 1; //--
	document.getElementById('newZero').value 				= 4; //--
	document.getElementById('trackAfter').value 			= "00:00"; //--
	document.getElementById('trackBefore').value 			= "23:59"; //--
	document.getElementById('autoNotifications').checked 	= false;//--
	document.getElementById('autoCount').value 				= 20; //--

	document.getElementById('checkClearHistory').checked 	= false;
	document.getElementById('notClearedNotification').checked 	= false; //---

	// Update status to let user know options were reset.
	var status = document.getElementById('status');
	status.textContent = 'Options have been reset to default.';


	//Create an "undo" option for if it is accidentally clicked
	var a = document.createElement('a');
	a.href = '#reset';
	a.appendChild(document.createTextNode(" undo"));
	a.addEventListener('click', function() {
		//For when undo is called
		var status = document.getElementById('status');
		status.textContent = "";
		status.appendChild(document.createElement('br'));

		//restore settings
		document.getElementById('checkHistory').checked 		= historyPermission;
		//document.getElementById('checkBookmarks').checked 		= bookmarksPermission;
		document.getElementById('checkTopSites').checked 		= topsitesPermission;
		document.getElementById('checkNotificions').checked 	= notifyPermission;
		document.getElementById('checkOrganiser').checked 		= organiserPermission;
		document.getElementById('checkRecommendations').checked = recommendPermission;//--

		document.getElementById('visitThresholdSite').value 	= visitSite;
		document.getElementById('visitThresholdPage').value 	= visitPage;//--
		document.getElementById('timeThreshold').value 			= timer;//--
		document.getElementById('timeThreshold').value 			= timer;
		document.getElementById('blacklist').value 				= ignored;
		document.getElementById('checkFrequency').value 		= checkFrequency;//--
		document.getElementById('timeRounding').value 			= timeRounding;	//--
		document.getElementById('newZero').value 				= newZero;		//--
		document.getElementById('trackAfter').value 			= trackAfter;	//--
		document.getElementById('trackBefore').value 			= trackBefore;	//--
		document.getElementById('autoNotifications').checked  	= autoNotifications;//--
		document.getElementById('autoCount').value 				= autoCount;		//--

		document.getElementById('checkClearHistory').checked 	= clearhistory;
		document.getElementById('notClearedNotification').checked 	= notClearedNotification;//---
	});
	status.appendChild(a);
}/**/
