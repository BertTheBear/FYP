
// Saves options to chrome.storage
function save_options() {
	//record the current settings
	var history  = document.getElementById('checkHistory').checked;
	var bookmarks = document.getElementById('checkBookmarks').checked;
	var topsites = document.getElementById('checkTopSites').checked;
	var notif 	 = 	document.getElementById('checkNotificions').checked;
	var organise = document.getElementById('checkOrganiser').checked;

	var visit 	 = document.getElementById('visitThreshold').value;
	var timer  	 = document.getElementById('timeThreshold').value;
	var ignored  = document.getElementById('blacklist').value;

	var clearhistory = document.getElementById('checkClearHistory').checked;
	chrome.storage.sync.set({
		history: history,
		bookmarks: bookmarks,
		topsites: topsites,
		notif: notif,
		organise: organise,
		visit: visit,
		weight:weight,
		timer: timer,
		ignored: ignored,
		clearhistory: clearhistory,
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
		history: true,
		bookmarks: true,
		topsites: true,
		notif: true,
		organise: true,
		visit: 3,
		weight: 2,
		timer: 28,
		ignored: "",
		clearhistory: false
	}, function(items) {
		document.getElementById('checkHistory').checked = items.history;
		document.getElementById('checkBookmarks').checked = items.bookmarks;
		document.getElementById('checkTopSites').checked = items.topsites;
		document.getElementById('checkNotificions').checked = items.notif;
		document.getElementById('checkOrganiser').checked = items.organise;

		document.getElementById('visitThreshold').value = items.visit;
		document.getElementById('timeThreshold').value = items.timer;
		document.getElementById('blacklist').value = items.ignored;
		document.getElementById('checkClearHistory').checked = items.clearhistory;
	});
}/**/




document.addEventListener('DOMContentLoaded', function() {
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('reset').addEventListener('click', reset_options);
	document.getElementById('clearHistorySettings').addEventListener('click', open_history_options);	
});




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
	var history  = document.getElementById('checkHistory').checked;
	var bookmarks = document.getElementById('checkBookmarks').checked;
	var topsites = document.getElementById('checkTopSites').checked;
	var notif 	 = 	document.getElementById('checkNotificions').checked;
	var organise = document.getElementById('checkOrganiser').checked;
	var visit 	 = document.getElementById('visitThreshold').value;
	var timer  	 = document.getElementById('timeThreshold').value;
	var ignored  = document.getElementById('blacklist').value;

	var clearhistory = document.getElementById('checkClearHistory').checked;

	//overwrite with default
	document.getElementById('checkHistory').checked 	= true;
	document.getElementById('checkBookmarks').checked 	= true;
	document.getElementById('checkTopSites').checked 	= true;
	document.getElementById('checkNotificions').checked = true;
	document.getElementById('checkOrganiser').checked 	= true;
	document.getElementById('visitThreshold').value 	= 3;
	document.getElementById('timeThreshold').value 		= 28;
	document.getElementById('blacklist').value 			= "";
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
		document.getElementById('checkHistory').checked 	= history;
		document.getElementById('checkBookmarks').checked 	= bookmarks;
		document.getElementById('checkTopSites').checked 	= topsites;
		document.getElementById('checkNotificions').checked = notif;
		document.getElementById('checkOrganiser').checked 	= organise;
		document.getElementById('visitThreshold').value 	= visit;
		document.getElementById('timeThreshold').value 		= timer;
		document.getElementById('blacklist').value 			= ignored;
		document.getElementById('checkClearHistory').checked 	= clearhistory;
	});
	status.appendChild(a);
}/**/


function open_history_options() {
	chrome.tabs.create({ 'url': 'chrome://settings/clearBrowserData'});
}
