chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
    var widget = document.createElement('div');
		widget.id = 'web-sticker'
		widget.innerHTML = '<a href="#">Install</a>';
		widget.className = "button";
		document.body.innerHTML += widget.innerHTML;
		// document.body.appendChild(download_btn);
    // $("body").append($(download_btn.innerHTML));
		console.log("Hello. This message was sent from scripts/inject.js");
	}
	}, 10);
});

function clickHandler(){
	alert(getSelectionText());
}

function getSelectionText(){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
