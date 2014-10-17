var webStickerVisible = false;
var windowProxy;
var embed_url = "http://localhost:3000/embed";
var initialized = false;
var highlighter = null;
var cssApplier = null;
var highlightClassName = "highlight-green";

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		//init rangy
		rangy.init();
		cssApplier = rangy.createCssClassApplier(highlightClassName, {
        normalize: true
    });
    highlighter = rangy.createHighlighter(document, "TextRange");
    highlighter.addClassApplier(cssApplier);

    buildMenu();
		buildProxy();
	}
	}, 10);
});

function clickHandler(){
  visibility = webStickerVisible ? 'hidden' : 'visible'
  webStickerVisible = !webStickerVisible;
  var menu = document.getElementById('web-sticker-menu');
  menu.style.visibility=visibility;
	if(!initialized){
		initialized = true;
		var root = location.protocol + '//' + location.host;
		var title = document.title
	  windowProxy.post({'action': 'initialize', 'url':root, 'pageTitle':title, 'pageUrl':location.pathname});
	}
	// alert(getSelectionText());
}

var buildMenu = function(){
  //menu items
  var menu_items = [];
  //TODO make each one it's own encapsulated object
  var add_sticker = {icon: 'icons/bookmark-3x.png', function: addItem};
  menu_items.push(add_sticker);

  var _body = document.getElementsByTagName('body') [0];

  //menu div
  var menu_div = document.createElement('div');
  menu_div.id = 'web-sticker-menu';
  menu_div.style.visibility='hidden';
	var iframe = document.createElement('IFRAME');
	iframe.setAttribute("src", embed_url);
	iframe.id = 'sticker-embed';
	iframe.name = 'sticker-embed';
  // ifrm.style.width = 640+"px";
  // ifrm.style.height = 480+"px";
	menu_div.appendChild(iframe);

  // for(var i = 0; i<menu_items.length; i++){
  //   item = menu_items[i]
  //   var div = document.createElement('div')
  //   div.className = 'web-menu';
  //   div.style.backgroundImage="url("+chrome.extension.getURL(item.icon)+")";
  //   div.addEventListener("click", item.function);
  //   menu_div.appendChild(div)
  // }

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
  var _body = document.getElementsByTagName('body') [0];
  _body.addEventListener("mouseup", captureItem);
}

var captureItem = function(){
  var range = rangy.getSelection();
  var se = rangy.serializeSelection(range, true);
  var _body = document.getElementsByTagName('body') [0];
  _body.removeEventListener("mouseup", captureItem);
	highlighter.highlightSelection(highlightClassName, range);
  windowProxy.post({'action': 'create', 'text':range.toString(), 'serializeRange': se});
  //TODO post success message to ui
}

var loadScripplets = function(scripplets){
	if(scripplets){
	  for(var i = 0; i < scripplets.length; i++){
      scripplet = scripplets[i];
			range = rangy.deserializeSelection(scripplet.serialize_range);
			highlighter.highlightSelection(highlightClassName, range);
	  }
  }
}

/** Message Communication Methods **/
function buildProxy(){
	// Create a proxy window to send to and receive
  // messages from the iFrame
  windowProxy = new Porthole.WindowProxy(embed_url, 'sticker-embed');

  // Register an event handler to receive messages;
  windowProxy.addEventListener(onMessage);
}

function onMessage(messageEvent) {
	switch(messageEvent.data.action) {
		case 'add-sticker':
			console.log("listening for item to add")
			addItem();
			break;
		case 'error':
			console.log("should show error");
			break;
		case 'success':
			console.log("should show success");
			break;
		case 'loadScripplets':
		  loadScripplets(messageEvent.data.scripplets);
			break;
	}
    /*
   messageEvent.origin: Protocol and domain origin of the message
   messageEvent.data: Message itself
   messageEvent.source: Window proxy object, useful to post a response
   */
}
