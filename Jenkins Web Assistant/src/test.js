
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
		startupProcess: 	true, 
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

		recommendations: 	[] 			//List of recommendations and categories
	}, function(items) {

	});



*/
/*

Set it to check if auto has website and then stop making more


history object
	url: , 				//string
	time: , 			//Date
	visits: , 			//int
	approved: , 		//boolean
	category: 			//string (optional)



recommendation objects:
	
	title: , 			//string (Optional)
	url: , 				//string
	category: , 		//String
	accepted: , 		//boolean
	blocked:  			//boolean


	accepted is when they follow link
	blocked is when the option is given to block after closing notification

	CATEGORIES
	
		categoryArray = ["animation", 			[0]
						"educational", 			[1]
						"email", 				[2]
						"entertainmentNews", 	[3]
						"finance", 				[4]
						"game", 				[5]
						"leisure", 				[6]
						"literature", 			[7]
						"music", 				[8]
						"news", 				[9]
						"searchEngine", 		[10]
						"shopping", 			[11]
						"socialMedia", 			[12]
						"sports", 				[13]
						"video", 				[14]
						"work", 				[15]//***
						"technology", 			[16]
						"television", 			[17]
						"travel" ];				[18]

	Animation {
		animehaven.org
		awkwardzombie.com
		crunchyroll.com 
		explosm.net
		funimation.com
		giantitp.com
		goblinscomic.org
		gocomics.com
		mangafox.me 
		mangareader.net
		mangatown.com 
		nerfnow.com
		penny-arcade.com
		pepperandcarrot.com
		poorlydrawnlines.com
		sarahcandersen.com
		smbc-comics.com
		theawkwardyeti.com
		theoatmeal.com
		xkcd.com
	}
	Educational {
		academia.edu
		blackboard.com 
		codecademy.com 
		coursera.org 
		duolingo.com 
		instructure.com
		khanacademy.com 
		scholar.google.com
		thesaurus.com 
		udemy.com 
		w3schools.com 
		wikimedia.org 
		wikipedia.org
		yelp.com 

	}
	Email {
		gmail.com 
		live.com 
		mail.google.com
		outlook.com 


	}
	Entertainment News {
		celebuzz.com
		dailyedge.ie 
		digitalspy.com 
		entertainment.ie 
		etonline.com
		her.ie 
		hollywoodlife.com 
		pudelek.pl 
		tmz.com 

	}
	Finance  {
		businessinsider.com
		etrade.com
		fidelity.com 
		finance.yahoo.com 
		fortune.com 
		investing.com 
		moneycontrol.com
		paypal.com 
		vanguard.com
		xe.com 

	}
	Game {
		battle.net 
		cardgames.io 
		chess.com 
		chess24.com 
		coolminiornot.com 
		ea.com 
		gameforge.com 
		gamespot.com 
		games-workshop.com 
		humblebundle.com 
		ign.com 
		jeuxvideo.com 
		kotaku.com 
		leagueoflegends.com 
		lichess.org 
		lumosity.com 
		online-go.com 
		playstation.com 
		reapermini.com 
		rockpapershotgun.com 
		steamcommunity.com 
		steampowered.com 
		twitch.tv 
		xbox.com 

	}
	Leisure {
		9gag.com
		cracked.com
		deviantart.com
		flickr.com
		gfycat.com
		imgur.com
		pinterest.com
		pixiv.net
		reddit.com

	}
	Literature {
		audible.com
		barnesandnoble.com 
		calibre-ebook.com
		christianbook.com
		fanfiction.net
		goodreads.com 
		gutenberg.org 
		pottermore.com
		safaribooksonline.com
		scholastic.com
		scribd.com 
		tvtropes.org 
		waterstones.com
		wattpad.com 
		wikibooks.org

	}
	Music {
		azlyrics.com 
		genius.com 
		https://play.google.com/music
		pandora.com 
		soundcloud.com
		spotify.com
		tunein.com 
		youtube-mp3.org

	}
	News {
		bbc.com/news
		bloomberg.com 
		businessinsider.com 
		engadget.com
		msn.com
		nytimes.com
		phys.org 
		sciencedaily.com
		sciencenews.org
		telegraph.co.uk
		theguardian.com 
		upi.com 
		washingtonpost.com 
		weather.com 
		yahoo.com

	}
	Search Engine {
		ask.com
		bing.com
		google.com
	}
	Shopping {
		adverts.ie 
		aldi.ie
		alibaba.com 
		aliexpress.com
		amazon.co.uk(Ugh... look into sorting this)
		amazon.com
		argos.com 
		donedeal.ie 
		ebay.com
		etsy.com 
		gearbest.com 
		sportsdirect.com
		tesco.ie 

	}
	Social Media {
		facebook.com
		instagram.com
		linkedin.com
		pinterest.com
		tumblr.com
		twitter.com

	}
	Sports {
		balls.ie 
		bet365.com 
		espn.com
		espn.go.com 
		football365.com 
		gaa.ie 
		goal.com 
		joe.ie 
		ladbrokes.com 
		livescore.com 
		national-lotter.co.uk
		nba.com 
		nbcsports.com
		nfl.com 
		paddypower.com
		premierleague.com 
		skybet.com 
		skysports.com 
		sports.yahoo.com 
		wwe.com 

	}
	Video {
		dailymotion.com
		filmon.com
		hulu.com 
		mtv.com 
		netflix.com
		nicovideo.jp 
		vimeo.com
		youtube.com

	}
	Work {

	}
	Technology {
		adobe.com 
		apple.com 
		dell.com 
		github.com 
		id.net 
		java.com
		microsoft.com
		mozilla.org
		office.com 
		oracle.com 
		play.google.com/Apps‎
		prezi.com
		python.org
		segmentfault.com
		sitepoint.com 
		sourceforge.net
		stackoverflow.com 
		trello.com

	}
	Television {
		bbc.com
		channel4.com 
		entertainment.ie
		go.com 
		imdb.com
		rottentomatoes.com
		rte.ie
		sky.com
		tvtropes.org

	}
	Travel {
		airbnb.com 
		booking.com 
		britishairways.com 
		easyjet.com 
		emirates.com 
		expedia.com 
		hotels.com 
		ryanair.com 
		tripadvisor.com
		trivago.com 

	}





	Internal Blacklist {
		bank
		pay 

	}
















/**/