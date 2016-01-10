// Saves options to chrome.storage
function save_options() {
	var history = document.getElementById('checkHistory').checked;
	var bookmarks = document.getElementById('checkBookmarks').checked;
	var topsites = document.getElementById('checkTopSites').checked;
	var notif 	= 	document.getElementById('checkNotificions').checked;
	var organise = document.getElementById('checkOrganiser').checked;

	var ignored = document.getElementById('blacklist').value;
	chrome.storage.sync.set({
		history: history,
		bookmarks: bookmarks,
		topsites: topsites,
		notif: notif,
		organise: organise,
		ignored: ignored
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = '- Options saved.';
		setTimeout(function() {
			status.textContent = "- ";
		}, 750);
	});
}

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
		ignored: ""
	}, function(items) {
		document.getElementById('checkHistory').checked = items.history;
		document.getElementById('checkBookmarks').checked = items.bookmarks;
		document.getElementById('checkTopSites').checked = items.topsites;
		document.getElementById('checkNotificions').checked = items.notif;
		document.getElementById('checkOrganiser').checked = items.organise;
		document.getElementById('blacklist').value = items.ignored;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
//for possible reset of all options in the future
document.getElementById('reset').addEventListener('click', reset_options);


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