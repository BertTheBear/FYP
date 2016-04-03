//id of extension
var myid = chrome.runtime.id;

var backgroundPage = chrome.extension.getBackgroundPage();






// =========== FOR GATHERING DOM FOR GATHERING META TAGS =====================
// Mostly inspired by http://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content


// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	//If the message received has the expected format
	if (msg.text === 'get_meta_tags') {
		//return the document's meta tags as an argument for the function
		//sendResponse(document.getElementsByTagName('meta'));
		sendResponse(document);
	}
});