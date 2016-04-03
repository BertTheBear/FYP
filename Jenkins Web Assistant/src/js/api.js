//*
 8888888888888888888888888888888 ALL SETTINGS REFERENCE 8888888888888888888888888888

//* means not put into options yet

	chrome.storage.sync.get({
		history: 				true,		//Whether we have permission to access browsing history
		//bookmarks: 			true,		//Whether we have permission to access bookmarks 						//Unused
		//topsites: 			true,		//Whether we have permission to access user's top sites 				//Unused
		notification: 			true,		//Whether we have permission to display notifications to the user
		organiser: 				true,		//Whether user wishes to use automatic organiser
		recommender: 			true 		//Whether we have permission to give site recommendations
	
		visitThreshold: 		3,			//Minimum number of visits to domain before it is recorded
		pageVisitThreshold: 	9			//Minimum number of visits before single web page is recorded
		typedWeight: 			2,			//Amount of visits a typed entry counts for
		timeThreshold: 			28,			//How far back in the history will the program check
		ignoreList: 			"",			//List of words or phrases to ignore
		checkFrequency: 		5,			//How often (In minutes) the program will check the schedule
		timeRounding: 			1,			//How will the process round the retrieved time (Nearest minute, 15 mins etc.)
		newZero: 				4,			//New time to set as 0 for purposes of late night browsing
		trackAfter: 			"00:00", 	//Lower hour limitation
		trackBefore: 			"23:59", 	//Upper hour limitation
		autoCount: 				20,			//max number of entries allowed by organiser
		autoNotifications:  	false, 		//Whether automatic recommendations can create notifications
		clearhistory: 			false,		//Whether user wishes to clear history at the "end" of each session
		notClearedNotification: false, 		//Whether the user should be notified when the history is not cleared
		schedule: 				[]			//The schedule of site time recommendations

		//The following may not be edited by the user and are simply using their default values. This may be changed later
		timeDeviation: 			6, 			//(In hours) how far apart the min and max must be before it checks 
		skewnessThreshold: 		2, 			//Skewness ratio threshold 						
	}, function(items) {

	});

	chrome.storage.local.get({
		recommendations: 			[], 		//List of recommendations and categories
		rejectedSchedule: 			[], 		//List of schedule items that have been rejected by the user (To be shown on the recommendations page)
		automaticClassification: 	[]			//List of words or tags to be used to automatically classify the current web page
		patternLastChecked: 		0, 			//So that the pattern will not be checked too frequently
		browsingPatterns: 			[] 			//Record of tab patterns stored as objects representing categories



/**/
//*



history object
	url: , 				//string
	time: , 			//Date (Stored as String)
	approved: , 		//boolean



recommendation objects:
	
	url: , 				//string
	category: , 		//String
	accepted: , 		//boolean
	blocked:  			//boolean


rejected schedule objects:

	url: 				//string
	count: 				//int

browsing pattern objects:
	
	pattern: 			//array
	count: 				//integer
	time: 				//

