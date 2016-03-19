var recListFile = 'recommendationList.txt';


//From http://stackoverflow.com/questions/18366191/import-text-file-using-javascript
function read(textFile) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', textFile);
    xhr.onload = show;
    xhr.send();
}

function show() {
    var div = document.createElement('div');
    var allTheText = this.response;
    var parts = allTheText.split("###"); //split into the two parts
    //The names of the categories in the first part, and the contents in the second

    //make an array of all of the categories
    //ignore the first one as this will be the update log and comments etc.
    var categories = parts[1].split(",");

    //Now separate all of the list elements
    var contents = parts[2].split("##");
    //Now make into an array of arrays
    var recommendations = new Array();
    for (var i = 0; i < categories.length; i++) {
        recommendations[i] = contents[i].split(",");
    }

    console.log(recommendations); //+++++++++++++++++++++++++
    //I think it works


    div.textContent = allTheText;
    document.body.appendChild(div);
}


document.addEventListener('DOMContentLoaded', function() {
	read(recListFile);
});