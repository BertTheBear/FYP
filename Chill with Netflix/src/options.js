// Saves options to chrome.storage
function save_options() {
  var colourSeen = document.getElementById('colourSeen').value;
  var colourList = document.getElementById('colourList').value;
  var checkBox = document.getElementById('check').checked;
  chrome.storage.sync.set({
    seenColour: colourSeen,
    listColour: colourList,
    boxChecked: checkBox
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    seenColour: 'green', 
    listColour: 'blue'
  }, function(items) {
    document.getElementById('colourSeen').value = items.favoriteColor;
    document.getElementById('colourList').value = items.favoriteColor;
    document.getElementById('check').checked = items.likesColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);