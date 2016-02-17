

//declare index variables as global
var startIndex = 0;
// These declare the last occurence of the category
var animationCount = 0;
var educationalCount = 0;
var emailCount = 0;
var entertainmentNewsCount = 0;
var financeCount = 0;
var gameCount = 0;
var leisureCount = 0;
var literatureCount = 0;
var musicCount = 0;
var newsCount = 0;
var searchEngineCount = 0;
var shoppingCount = 0;
var socialMediaCount = 0;
var sportsCount = 0;
var videoCount = 0;
var workCount = 0;
var technologyCount = 0;
var televisionCount = 0;
var travelCount = 0;




//Dis list gon be big
function thing() {
	//Get existing list
	chrome.storage.sync.get({
		recommendations: []
	}, function(items){

		var found = false;
		var i = 0;

		//Define all of the category names
		categoryArray = ["animation", 
						"educational", 
						"email", 
						"entertainmentNews", 
						"finance", 
						"game", 
						"leisure", 
						"literature", 
						"music", 
						"news", 
						"searchEngine", 
						"shopping", 
						"socialMedia", 
						"sports", 
						"video", 
						"work", 
						"technology", 
						"television", 
						"travel" ];




		//Array of all arrays
		var allArrays = new Array();

		//Arrays of URLs
		//The first element of each array is the name of the category, and derived from the categoryArray
		//This is mostly to keep track of the different categories in case more are added
		var animationArray 		= [ categoryArray[0], 
								"animehaven.org", 
								"awkwardzombie.com", 
								"crunchyroll.com", 
								"explosm.net", 
								"funimation.com", 
								"giantitp.com", 
								"goblinscomic.org", 
								"gocomics.com", 
								"mangafox.me", 
								"mangareader.net", 
								"mangatown.com", 
								"nerfnow.com", 
								"penny-arcade.com", 
								"pepperandcarrot.com", 
								"poorlydrawnlines.com", 
								"sarahcandersen.com", 
								"smbc-comics.com", 
								"theawkwardyeti.com", 
								"theoatmeal.com", 
								"xkcd.com" ];
		allArrays.push(animationArray);

		var educationalArray 	= [ categoryArray[1], 
								"academia.edu", 
								"blackboard.com", 
								"codecademy.com", 
								"coursera.org", 
								"duolingo.com", 
								"instructure.com", 
								"khanacademy.com", 
								"scholar.google.com", 
								"thesaurus.com", 
								"udemy.com", 
								"w3schools.com", 
								"wikimedia.org", 
								"wikipedia.org", 
								"yelp.com " ];
		allArrays.push(educationalArray);

		var emailArray 			= [ categoryArray[2], 
								"gmail.com", 
								"live.com", 
								"mail.google.com", 
								"outlook.com " ];
		allArrays.push(emailArray);

		var entertainmentNews 	= [ categoryArray[3], 
								"celebuzz.com", 
								"dailyedge.ie", 
								"digitalspy.com", 
								"entertainment.ie", 
								"etonline.com", 
								"her.ie", 
								"hollywoodlife.com", 
								"pudelek.pl", 
								"tmz.com " ];
		allArrays.push(entertainmentNews);

		var financeArray 		= [ categoryArray[4], 
								"businessinsider.com", 
								"etrade.com", 
								"fidelity.com", 
								"finance.yahoo.com", 
								"fortune.com", 
								"investing.com", 
								"moneycontrol.com", 
								"paypal.com", 
								"vanguard.com", 
								"xe.com" ];
		allArrays.push(financeArray);

		var gameArray 			= [ categoryArray[5], 
								"battle.net", 
								"cardgames.io", 
								"chess.com", 
								"chess24.com", 
								"coolminiornot.com", 
								"ea.com", 
								"gameforge.com", 
								"gamespot.com", 
								"games-workshop.com", 
								"humblebundle.com", 
								"ign.com", 
								"jeuxvideo.com", 
								"kotaku.com", 
								"leagueoflegends.com", 
								"lichess.org", 
								"lumosity.com", 
								"online-go.com", 
								"playstation.com", 
								"reapermini.com", 
								"rockpapershotgun.com", 
								"steamcommunity.com", 
								"steampowered.com", 
								"twitch.tv", 
								"xbox.com" ];
		allArrays.push(gameArray);

		var leisureArray 		= [ categoryArray[6], 
								"9gag.com", 
								"cracked.com", 
								"deviantart.com", 
								"flickr.com", 
								"gfycat.com", 
								"imgur.com", 
								"pinterest.com", 
								"pixiv.net", 
								"reddit.com", 
								"tumblr.com" ];
		allArrays.push(leisureArray);

		var literatureArray 	= [ categoryArray[7], 
								"audible.com", 
								"barnesandnoble.com", 
								"calibre-ebook.com", 
								"christianbook.com", 
								"fanfiction.net", 
								"goodreads.com", 
								"gutenberg.org", 
								"pottermore.com", 
								"safaribooksonline.com", 
								"scholastic.com", 
								"scribd.com", 
								"tvtropes.org", 
								"waterstones.com", 
								"wattpad.com", 
								"wikibooks.org" ];
		allArrays.push(literatureArray);

		var musicArray 			= [ categoryArray[8], 
								"azlyrics.com", 
								"genius.com", 
								"https://play.google.com/music", 
								"pandora.com",
								"soundcloud.com", 
								"spotify.com", 
								"tunein.com", 
								"youtube-mp3.org" ];
		allArrays.push(musicArray);

		var newsArray 			= [ categoryArray[9], 
								"bbc.com/news", 
								"bloomberg.com", 
								"businessinsider.com", 
								"engadget.com", 
								"msn.com", 
								"nytimes.com", 
								"phys.org", 
								"sciencedaily.com", 
								"sciencenews.org", 
								"telegraph.co.uk", 
								"theguardian.com", 
								"upi.com", 
								"washingtonpost.com", 
								"weather.com", 
								"yahoo.com" ];
		allArrays.push(newsArray);

		var searchEngineArray 	= [ categoryArray[10], 
								"ask.com", 
								"bing.com", 
								"google.com" ];
		allArrays.push(searchEngineArray);

		var shoppingArray 		= [ categoryArray[11], 
								"adverts.ie", 
								"aldi.ie", 
								"alibaba.com", 
								"aliexpress.com", 
								"amazon.co.uk", 
								"amazon.com", 
								"argos.com", 
								"donedeal.ie", 
								"ebay.com", 
								"etsy.com", 
								"gearbest.com", 
								"sportsdirect.com", 
								"tesco.ie" ];
		allArrays.push(shoppingArray);

		var socialMediaArray 	= [ categoryArray[12], 
								"facebook.com", 
								"instagram.com", 
								"linkedin.com", 
								"pinterest.com", 
								"tumblr.com", 
								"twitter.com" ];
		allArrays.push(socialMediaArray);

		var sportsArray 		= [ categoryArray[13], 
								"balls.ie", 
								"bet365.com", 
								"espn.go.com", 
								"football365.com", 
								"gaa.ie", 
								"goal.com", 
								"joe.ie", 
								"ladbrokes.com", 
								"livescore.com", 
								"national-lotter.co.uk", 
								"nba.com", 
								"nbcsports.com", 
								"nfl.com", 
								"paddypower.com", 
								"premierleague.com", 
								"skybet.com", 
								"skysports.com", 
								"sports.yahoo.com", 
								"wwe.com" ];
		allArrays.push(sportsArray);

		var videoArray 			= [ categoryArray[14], 
								"dailymotion.com", 
								"filmon.com", 
								"hulu.com", 
								"mtv.com", 
								"netflix.com", 
								"nicovideo.jp", 
								"vimeo.com", 
								"youtube.com" ];
		allArrays.push(videoArray);	

		var workArray 			= [categoryArray[15]];
		allArrays.push(workArray);			

		var technologyArray 	= [ categoryArray[16], 
								"adobe.com", 
								"apple.com", 
								"dell.com", 
								"github.com", 
								"id.net", 
								"java.com", 
							 	"microsoft.com", 
							 	"mozilla.org", 
							 	"office.com", 
							 	"oracle.com", 
							 	"play.google.com/Apps‎", 
							 	"prezi.com", 
							 	"python.org", 
							 	"segmentfault.com", 
							 	"sitepoint.com", 
							 	"sourceforge.net", 
							 	"stackoverflow.com", 
							 	"trello.com" ];
		allArrays.push(technologyArray);

		var televisionArray 	= [ categoryArray[17], 
								"bbc.com", 
								"channel4.com", 
								"entertainment.ie", 
								"go.com", 
								"imdb.com", 
								"netflix.com", 
								"rottentomatoes.com", 
								"rte.ie", 
								"sky.com", 
								"tvtropes.org" ];
		allArrays.push(televisionArray);

		var travelArray 		= [ categoryArray[18], 
								"airbnb.com", 
								"booking.com", 
								"britishairways.com", 
								"easyjet.com", 
								"emirates.com", 
								"expedia.com", 
								"hotels.com", 
								"ryanair.com", 
								"tripadvisor.com", 
								"trivago.com" ];
		allArrays.push(travelArray);

		//All above are in alphabetical order




		//Declare variables for use below
		var index = 0;
		var url = "";
		var lowerLimit = 0;
		var upperLimit = 0;


		var lastStartIndex = startIndex;
		var lastCount = 0;

		for(var outerIndex = 0; outerIndex < allArrays.length; outerIndex++) {
			//Initialise new start index
			var thisStartIndex = lastStartIndex + lastCount;
			var thisArray = allArrays[outerIndex];
			var thisCount = thisArray.length; //Count should equal array length
			var thisCategory = thisArray[0];  //First entry is always category name

			//For each element in animation index, search existing array for url
			//Start at 1 to skip the category string
			for(index = 1; index < thisArray.length; index++) {

				//Set variables for binary search
				url = thisArray[index];
				lowerLimit = thisStartIndex;
				upperLimit = lowerLimit + thisCount - 1; //-1 because arrays start at 0

				//Search for url inside range of category
				var found = urlBinarySearch(url, items.recommendations, lowerLimit, upperLimit);

				//If not found
				if(found < 0) {
					//create object to add to array.
					var tempObject = new Object();
					tempObject.category = thisCategory;
					tempObject.accepted = false;
					tempObject.blocked = false;
					tempObject.url = url;

					//if not found add tempObject to array with new url using binary sort
					items.recommendations = addAlphabetically(tempObject, items.recommendations, lowerLimit, upperLimit);
					thisCount++;
				}
				
			}


			//Set current start index as old index
			lastStartIndex = thisStartIndex;
			lastCount = thisCount;
		}









		//Save new array of recommendations
		//Must be stored locally due to size constraints
		chrome.storage.local.set({
			recommendations: items.recommendations
		}, function(){
			console.log("Saved: "); //+++++++++++++++++++++++++++++++
			console.log(items.recommendations);//++++++++++++++++++++

			//callback function not used yet?
		});
	});
}

//basic binary search
function urlBinarySearch(url, recommendationArray, lowerLimit, upperLimit) {

	//If limit is higher than array. This should only be on initial runs
	if(upperLimit > recommendationArray.length)
		upperLimit = recommendationArray.length - 1; //Because arrays start at 0, not 1

	//find middle value
	var middle = Math.round((lowerLimit + upperLimit) / 2);

	//Divide and search until upperLimit is no longer greater than lowerLimit (Which means it's not found)
	while (lowerLimit <= upperLimit) {

		//If found return index
		if (recommendationArray[middle].url == url) {
			return middle;
		}//If smaller than middle, make middle - 1 the new upper limit
		else if(recommendationArray[middle].url > url) {
			upperLimit = middle - 1;
		}//If larger than middle, make middle + 1 the new lower limit
		else /*if(recommendationArray[middle].url < url)*/ {
			lowerLimit = middle + 1;
		}


		//Then find the new middle and start again
		middle = Math.round((lowerLimit + upperLimit) / 2);
	}
	//If not found
	return -1;

}

function addAlphabetically(object, recommendationArray, lowerLimit, upperLimit) {

	//If limit is higher than array. This should only be on initial runs
	if(upperLimit > recommendationArray.length)
		upperLimit = recommendationArray.length - 1; //Because arrays start at 0, not 1


	//find middle value
	var middle = Math.round((lowerLimit + upperLimit) / 2);

	//extract url for comparisons
	var url = object.url;


	//Divide and search until upperLimit is no longer greater than lowerLimit (Which means it's not found)
	while (lowerLimit <= upperLimit) {

		//If found return array and display error
		if (recommendationArray[middle].url == url) {
			console.log("Error. Duplicate found");
			return recommendationArray;
		}//If smaller than middle, make middle - 1 the new upper limit
		else if(recommendationArray[middle].url > url) {
			upperLimit = middle - 1;
		}//If larger than middle, make middle + 1 the new lower limit
		else /*if(recommendationArray[middle].url < url)*/ {
			lowerLimit = middle + 1;
		}


		//Then find the new middle and start again
		middle = Math.round((lowerLimit + upperLimit) / 2);
	}

	//Put new object into "middle" location
	recommendationArray.splice(middle, 0, object);


	//return edited array
	return recommendationArray;
}