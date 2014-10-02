chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

    var widget = document.createElement('div');
		widget.id = 'web-sticker'
		widget.style.backgroundImage="url("+chrome.extension.getURL('icons/orange48.png')+")";
		document.body.innerHTML += widget.outerHTML;
		$('#web-sticker').click(clickHandler);

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
