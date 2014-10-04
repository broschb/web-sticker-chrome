menu = "<ul id='web-sticker-menu'>"+
       "<li>"+
			 "<a href='#'>Menu 1</a>"+
			 "<ul>"
       "<li><a href='#'>Sub Menu 1</a></li>"+
       "<li><a href='#'>Sub Menu 2</a></li>"+
       "<li><a href='#'>Sub Menu 3</a></li>"+
       "</ul>"
			 "</li>"
			 "</ul>";
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

    var widget = document.createElement('div');
		widget.id = 'web-sticker'
		widget.style.backgroundImage="url("+chrome.extension.getURL('icons/orange48.png')+")";
		// widget.innerHTML = menu;
    var _body = document.getElementsByTagName('body') [0];
    _body.appendChild(widget);
		// document.body.innerHTML += widget.outerHTML;
    // console.log(document.body.innerHTML)
		document.getElementById('web-sticker').addEventListener("click", clickHandler);
		// submenu("web-sticker-menu");
	}
	}, 10);
});

function clickHandler(){
	alert(getSelectionText());
}

var getSelectionText = function(){
   console.log("click")
    var text = "";
    // if (window.getSelection) {
        // text = window.getSelection().toString();
    // } else if (document.selection && document.selection.type != "Control") {
        // text = document.selection.createRange().text;
    // }
    return text;
}
