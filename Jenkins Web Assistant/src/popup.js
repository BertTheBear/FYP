//id of extension
var myid = chrome.runtime.id;




// OPTIONS OPENING +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
document.getElementById('opts').addEventListener('click', open_options);

function open_options() {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + myid });
}
//*/ //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



