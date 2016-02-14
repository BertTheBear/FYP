//id of extension
var myid = chrome.runtime.id;



//################ For temp no notify ###################
//set triggers 
document.addEventListener('DOMContentLoaded', function() {
	restore_checkbox();
	document.getElementById('checkTempNotify').addEventListener('click', save_options);
	document.getElementById('opts').addEventListener('click', chrome.extension.getBackgroundPage().open_options);
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