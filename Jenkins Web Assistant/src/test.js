//id of extension
var myid = chrome.runtime.id;


//How many minutes to wait
var minutesPerInterval = 5;
var microsecondsPerMinute = 1000 * 60;
//time to wait between schedule checks
var timeToWait = microsecondsPerMinute * minutesPerInterval;


document.addEventListener('DOMContentLoaded', function () {
	console.log("ARRRRARRARARRA");
	document.getElementById('bleh').addEventListener('click', clearHistory);
	
});
















/* 8888888888888888888888888888888 ALL SETTINGS REFERENCE 8888888888888888888888888888

//* means not put into options yet

	chrome.storage.sync.get({
		history: 			true,		//Whether we have permission to access browsing history
		bookmarks: 			true,		//Whether we have permission to access bookmarks
		topsites: 			true,		//Whether we have permission to access user's top sites
		notification: 		true,		//Whether we have permission to display notifications to the user
		organiser: 			true,		//Whether user wishes to use automatic organiser
		recommender: 		true 		//Whether we have permission to give site recommendations
		visitThreshold: 	3,			//Minimum number of visits to domain before it is recorded
		pageVisitThreshold: 9			//Minimum number of visits before single web page is recorded
		typedWeight: 		2,			//Amount of visits a typed entry counts for
		timeThreshold: 		28,			//How far back in the history will the program check
		ignoreList: 		"",			//List of words or phrases to ignore
		*ignoreQuery: 		true, 			//Whether to ignore queries in processing
		checkFrequency: 	5,			//How often (In minutes) the program will check the schedule
		timeRounding: 		1,			//How will the process round the retrieved time (Nearest minute, 15 mins etc.)
		newZero: 			4,			//New time to set as 0 for purposes of late night browsing
		trackAfter: 		"00:00", 	//Lower hour limitation
		trackBefore: 		"23:59", 	//Upper hour limitation
		autoCount: 			20,			//max number of entries allowed by organiser
		*timeDeviation: 		6, 			//(In hours) how far the min and max must be before it checks
		*skewnessThreshold: 	2, 			//Skewness ratio threshold
		autoNotifications:  false, 		//Whether automatic recommendations can create notifications
		clearhistory: 		false,		//Whether user wishes to clear history at the "end" of each session
		notClearedNotification : false, //Whether the user should be notified when the history is not cleared
		internalIgnoreList: "",			//List of items to ignore as set by creator(Me) For use with words that break the organiser
		schedule: 			[]			//The schedule of site time recommendations
	}, function(items) {

	});


Set it to check if auto has website and then stop making more



*/