var webStickerVisible = false;
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
    buildMenu();
	}
	}, 10);
});

function clickHandler(){
  visibility = webStickerVisible ? 'hidden' : 'visible'
  webStickerVisible = !webStickerVisible;
  var menu = document.getElementById('web-sticker-menu');
  menu.style.visibility=visibility;
	// alert(getSelectionText());
}

var buildMenu = function(){
  //menu items
  var menu_items = [];
  var add_sticker = {icon: 'icons/bookmark-3x.png', function: addItem};
  menu_items.push(add_sticker);

  var _body = document.getElementsByTagName('body') [0];

  //menu div
  var menu_div = document.createElement('div');
  menu_div.id = 'web-sticker-menu'
  menu_div.style.visibility='hidden'
  for(var i = 0; i<menu_items.length; i++){
    item = menu_items[i]
    var div = document.createElement('div')
    div.className = 'web-menu';
    div.style.backgroundImage="url("+chrome.extension.getURL(item.icon)+")";
    div.addEventListener("click", item.function);
    menu_div.appendChild(div)
  }

  //button div
  var widget = document.createElement('div');
  widget.id = 'web-sticker'
  widget.style.backgroundImage="url("+chrome.extension.getURL('icons/orange48.png')+")";

  //append to body
  _body.appendChild(menu_div);
  _body.appendChild(widget);

  //listeners
  document.getElementById('web-sticker').addEventListener("click", clickHandler);
}

var addItem = function(){
  console.log('adding');
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
