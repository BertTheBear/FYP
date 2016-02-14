
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
		//Find Countes of all of the categories
		var found = false;
		var i = 0;

		categoryArray = ["animation", "educational", "email", "entertainmentNews", "finance", "game", 
			"leisure", "literature", "music", "news", "searchEngine", "shopping", "socialMedia", 
			"sports", "video", "work", "technology", "television", "travel" ];


//Refraining from using nested loops because I want to have the index have discernable names
		for(var x = 0; x < categoryArray.length; x++) {
			found = false;

			//If category matches increment counter
			while(i < recommendations.length && !found) {
				if(recommendations[i].category != categoryArray[x]) {
					found = true;//exits while loop and moves onto next element of category array
				}
				else {
					//Switch is faster than if/else etc
					// case matches category from array
					switch(categoryArray[x]) {
						case "animation":
							animationCount++;
							break;
						case "educational":
							educationalCount++;
							break;
						case "email":
							emailCount++;
							break;
						case "entertainmentNews":
							entertainmentNewsCount++;
							break;
						case "finance":
							financeCount++;
							break;
						case "game":
							gameCount++;
							break;
						case "leisure":
							leisureCount++;
							break;
						case "literature":
							literatureCount++;
							break;
						case "music":
							musicCount++;
							break;
						case "news":
							newsCount++;
							break;
						case "searchEngine":
							searchEngineCount++;
							break;
						case "shopping":
							shoppingCount++;
							break;
						case "socialMedia":
							socialMediaCount++;
							break;
						case "sports":
							sportsCount++;
							break;
						case "video":
							videoCount++;
							break;
						case "work":
							workCount++;
							break;
						case "technology":
							technologyCount++;
							break;
						case "television":
							televisionCount++;
							break;
						case "travel":
							travelCount++;
							break;
						default: 	//Error
							console.log("Something went wrong");
					}
					//Only increment along array if correct
					i++;
				}
			}
		}

		//Arrays of URLs
		var animationArray 		= ["animehaven.org", "awkwardzombie.com", "crunchyroll.com", 
			"explosm.net", "funimation.com", "giantitp.com", "goblinscomic.org", "gocomics.com", 
			"mangafox.me", "mangareader.net", "mangatown.com", "nerfnow.com", "penny-arcade.com", 
			"pepperandcarrot.com", "poorlydrawnlines.com", "sarahcandersen.com", "smbc-comics.com", 
			"theawkwardyeti.com", "theoatmeal.com", "xkcd.com" ];
		var educationalArray 	= ["academia.edu", "blackboard.com", "codecademy.com", "coursera.org", 
			"duolingo.com", "instructure.com", "khanacademy.com", "scholar.google.com", "thesaurus.com", 
			"udemy.com", "w3schools.com", "wikimedia.org", "wikipedia.org", "yelp.com " ];
		var emailArray 			= ["gmail.com", "live.com", "mail.google.com", "outlook.com " ];
		var entertainmentNews 	= ["celebuzz.com", "dailyedge.ie", "digitalspy.com", "entertainment.ie", 
			"etonline.com", "her.ie", "hollywoodlife.com", "pudelek.pl", "tmz.com " ];
		var financeArray 		= ["businessinsider.com", "etrade.com", "fidelity.com", "finance.yahoo.com", 
			"fortune.com", "investing.com", "moneycontrol.com", "paypal.com", "vanguard.com", "xe.com"];
		var gameArray 			= ["battle.net", "cardgames.io", "chess.com", "chess24.com", 
		 	"coolminiornot.com", "ea.com", "gameforge.com", "gamespot.com", "games-workshop.com", 
		 	"humblebundle.com", "ign.com", "jeuxvideo.com", "kotaku.com", "leagueoflegends.com", 
		 	"lichess.org", "lumosity.com", "online-go.com", "playstation.com", "reapermini.com", 
		 	"rockpapershotgun.com", "steamcommunity.com", "steampowered.com", "twitch.tv", "xbox.com"];
		var leisureArray 		= ["9gag.com", "cracked.com", "deviantart.com", "flickr.com", "gfycat.com", 
			"imgur.com", "pinterest.com", "pixiv.net", "reddit.com", "tumblr.com"];
		var literatureArray 	= ["audible.com", "barnesandnoble.com", "calibre-ebook.com", "christianbook.com", 
			"fanfiction.net", "goodreads.com", "gutenberg.org", "pottermore.com", "safaribooksonline.com", 
			"scholastic.com", "scribd.com", "tvtropes.org", "waterstones.com", "wattpad.com", "wikibooks.org"];
		var musicArray 			= ["azlyrics.com", "genius.com", "https://play.google.com/music", "pandora.com",
			"soundcloud.com", "spotify.com", "tunein.com", "youtube-mp3.org"];
		var newsArray 			= ["bbc.com/news", "bloomberg.com", "businessinsider.com", "engadget.com", 
			"msn.com", "nytimes.com", "phys.org", "sciencedaily.com", "sciencenews.org", "telegraph.co.uk", 
			"theguardian.com", "upi.com", "washingtonpost.com", "weather.com", "yahoo.com"];
		var searchEngineArray 	= ["ask.com", "bing.com", "google.com"];
		var shoppingArray 		= ["adverts.ie", "aldi.ie", "alibaba.com", "aliexpress.com", "amazon.co.uk", "amazon.com", 
			"argos.com", "donedeal.ie", "ebay.com", "etsy.com", "gearbest.com", "sportsdirect.com", "tesco.ie"];
		var socialMediaArray 	= ["facebook.com", "instagram.com", "linkedin.com", "pinterest.com", "tumblr.com", 
		 	"twitter.com"];
		var sportsArray 		= ["balls.ie", "bet365.com", "espn.com", "espn.go.com", "football365.com", 
		 	"gaa.ie", "goal.com", "joe.ie", "ladbrokes.com", "livescore.com", "national-lotter.co.uk", "nba.com", 
		 	"nbcsports.com", "nfl.com", "paddypower.com", "premierleague.com", "skybet.com", "skysports.com", 
		 	"sports.yahoo.com", "wwe.com"];
		var videoArray 			= ["dailymotion.com", "filmon.com", "hulu.com", "mtv.com", "netflix.com", 
		 	"nicovideo.jp", "vimeo.com", "youtube.com"];
		var workArray 			= [];
		var technologyArray 	= ["adobe.com", "apple.com", "dell.com", "github.com", "id.net", "java.com", 
		 	"microsoft.com", "mozilla.org", "office.com", "oracle.com", "play.google.com/Apps‎", "prezi.com", 
		 	"python.org", "segmentfault.com", "sitepoint.com", "sourceforge.net", "stackoverflow.com", "trello.com"];
		var televisionArray 	= ["bbc.com", "channel4.com", "entertainment.ie", "go.com", "imdb.com", 
			"netflix.com", "rottentomatoes.com", "rte.ie", "sky.com", "tvtropes.org"];
		var travelArray 		= ["airbnb.com", "booking.com", "britishairways.com", "easyjet.com", 
			"emirates.com", "expedia.com", "hotels.com", "ryanair.com", "tripadvisor.com", "trivago.com"];


		//Declare j and index for use below
		var outerIndex = 0;
		var innerIndex = 0;

		//animation
		var animationStartIndex = startIndex;
		var animation = new Object();
		animation.category = "animation";
		animation.accepted = false;
		animation.blocked = false;

		innerIndex = animationStartIndex;

		//For each element in animation index, search existing array for url
		for(outerIndex = 0; outerIndex < animationArray.length; outerIndex++) {
			found = false;
			innerIndex = animationStartIndex;
			//Search for url inside range of category
			while(innerIndex < (animationStartIndex + animationCount) && !found) {
				if(recommendations[innerIndex].url == animationArray[outerIndex])
					found = true;
				innerIndex++;
			}
			//If not found reset innerIndex to 0 and add to count
			if(!found) {
				animation.url = animationArray[outerIndex];
				innerIndex = 0;
				//add to recommendations alphabetically
				recommendations = addAlphabetically(animation, animationStartIndex, recommendations);
				animationCount++;
			}
		}
		


		//educational
		var educational = new Object();
		educational.category = "educational";
		educational.accepted = false;
		educational.blocked = false;

		//email
		var email = new Object();
		email.category = "email";
		email.accepted = false;
		email.blocked = false;

		//entertainmentNews
		var entertainmentNews = new Object();
		entertainmentNews.category = "entertainmentNews";
		entertainmentNews.accepted = false;
		entertainmentNews.blocked = false;

		//finance
		var finance = new Object();
		finance.category = "finance";
		finance.accepted = false;
		finance.blocked = false;

		//game
		var game = new Object();
		game.category = "game";
		game.accepted = false;
		game.blocked = false;

		//leisure
		var leisure = new Object();
		leisure.category = "leisure";
		leisure.accepted = false;
		leisure.blocked = false;

		//literature
		var literature = new Object();
		literature.category = "literature";
		literature.accepted = false;
		literature.blocked = false;

		//music
		var music = new Object();
		music.category = "music";
		music.accepted = false;
		music.blocked = false;

		//news
		var news = new Object();
		news.category = "news";
		news.accepted = false;
		news.blocked = false;

		//searchEngine
		var searchEngine = new Object();
		searchEngine.category = "searchEngine";
		searchEngine.accepted = false;
		searchEngine.blocked = false;

		//shopping
		var shopping = new Object();
		shopping.category = "shopping";
		shopping.accepted = false;
		shopping.blocked = false;

		//social media
		var socialMedia = new Object();
		socialMedia.category = "socialMedia";
		socialMedia.accepted = false;
		socialMedia.blocked = false;

		//sports
		var sports = new Object();
		sports.category = "sports";
		sports.accepted = false;
		sports.blocked = false;

		//video
		var video = new Object();
		video.category = "video";
		video.accepted = false;
		video.blocked = false;

		//work
		var work = new Object();
		work.category = "work";
		work.accepted = false;
		work.blocked = false;

		//technology
		var technology = new Object();
		technology.category = "technology";
		technology.accepted = false;
		technology.blocked = false;

		//television
		var television = new Object();
		television.category = "television";
		television.accepted = false;
		television.blocked = false;

		//travel
		var travel = new Object();
		travel.category = "travel";
		travel.accepted = false;
		travel.blocked = false;
	});
}


function urlBinarySearch(url, recommendationArray, lowerLimit, upperLimit) {

}

function addAlphabetically(object, recommendationArray, lowerLimit, upperLimit) {

}