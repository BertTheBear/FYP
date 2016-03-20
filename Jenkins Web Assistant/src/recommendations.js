var recListFile = 'recommendationList.json';

document.addEventListener('DOMContentLoaded', function() {
	read(recListFile);
});



//From http://stackoverflow.com/questions/18366191/import-text-file-using-javascript
function read(textFile) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', textFile);
    xhr.onload = show;
    xhr.send();
}

function show() {
    var div = document.createElement('div');
    //Put all of the text into a string
    var allTheText = this.response;
    //make an object of the parsed string
    var recObject = JSON.parse(allTheText);

    var recommendations = recObject.recommendations;

    console.log(recommendations); //+++++++++++++++++++++++++
    //I think it works


    div.textContent = allTheText;
    document.body.appendChild(div);
}