/*

//Code taken from background before replacing with JSON stuff

	//Define all of the category names
		var categoryArray = ["animation", 
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
						"technology", 
						"television", 
						"travel",
						"video", 
						"work" ];




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

		var technologyArray 	= [ categoryArray[14], 
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

		var televisionArray 	= [ categoryArray[15], 
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

		var travelArray 		= [ categoryArray[16], 
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

		var videoArray 			= [ categoryArray[17],  //Problem here
								"dailymotion.com", 
								"filmon.com", 
								"hulu.com", 
								"mtv.com", 
								"netflix.com", 
								"nicovideo.jp", 
								"vimeo.com", 
								"youtube.com" ];
		allArrays.push(videoArray);	

		var workArray 			= [ categoryArray[18]];
		allArrays.push(workArray);

		//All above are in alphabetical order



*/