chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
    $("<div id='websticker'>Click Me!</div>").appendTo("body");
    $("body").append("<div id='websticker'>Click Me!</div>");
		$("#websticker").button().click(clickHandler);
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
