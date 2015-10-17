var webStickerVisible = false;
var windowProxy;
var embed_url = "http://www.scribblet.net/embed";
var initialized = false;
var highlighter = null;
var cssApplier = null;
var highlightClassName = "highlight-green";
var __devMode = null;
var scribbletsArray = null;
var scribbletsVisible = false;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		isDevMode();
		if(__devMode){
		  embed_url = "http://localhost:5000/embed";
		}

		//init rangy
		rangy.init();
		cssApplier = rangy.createCssClassApplier(highlightClassName, {
        normalize: true
    });
    highlighter = rangy.createHighlighter(document, "TextRange");
    highlighter.addClassApplier(cssApplier);

    buildTopBar();
    buildMenu();
		buildProxy();
	}
	}, 10);
});

function isDevMode() {
    if (__devMode == null) {
        var mUrl = chrome.runtime.getURL('manifest.json');
        var xhr = new XMLHttpRequest();
        xhr.open("GET", mUrl, false);
        xhr.onload = function () {
            var json = JSON.parse(this.responseText);
            __devMode = !('update_url' in json);
            console.log("__devMode: " + __devMode);
        };
        xhr.send();
    }
    return __devMode
}

function clickHandler(){
  visibility = webStickerVisible ? 'hidden' : 'visible'
  webStickerVisible = !webStickerVisible;
  var menu = document.getElementById('web-sticker-menu');
  menu.style.visibility=visibility;
	// alert(getSelectionText());
}

var buildTopBar = function(){
  var toolbarHeight = 50;

  var div = document.createElement("div");
  div.id = "notification-bar";

  var _body = document.getElementsByTagName('body') [0];
	_body.appendChild(div);
  // document.documentElement.appendChild(div);
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
	iframe.frameBorder = '0';
	menu_div.appendChild(iframe);

  //button div
  var widget = document.createElement('div');
  widget.id = 'web-sticker';
	widget.className = 'oi';
	widget.setAttribute('data-glyph','bookmark');
  // widget.style.backgroundImage="url("+chrome.extension.getURL('icons/scribblet_icon.png')+")";

  var countDiv = document.createElement('div');
	countDiv.id = 'scribblet-count';
	countDiv.className = 'numberCircle';
  widget.appendChild(countDiv);
  //append to body
  _body.appendChild(menu_div);
  _body.appendChild(widget);

  //listeners
  document.getElementById('web-sticker').addEventListener("click", clickHandler);
}

var showWarning = function(msg, timeout){
	timeout = typeof timeout !== 'undefined' ? timeout : false;
	$("#notification-bar").removeClass();
	$("#notification-bar").addClass("scribblet-warning");
  showMessage(msg);
	if(timeout == true){
		setTimeout(hideMessage,2000);
	}
}

var showSuccess = function(msg){
	$("#notification-bar").removeClass();
	$("#notification-bar").addClass("scribblet-success");
	showMessage(msg);
	setTimeout(hideMessage,2000);
}

var showMessage = function(msg){
	$('#notification-bar').html(msg);
	$('#notification-bar').fadeIn("fast");
}

var hideMessage = function(){
	$('#notification-bar').html('');
	$('#notification-bar').fadeOut("fast");
}

var showCount = function(count){
  if(count > 0){
		$('#scribblet-count').html(count);
		$('#scribblet-count').fadeIn("fast");
	}
}

var addItem = function(){
  showWarning("Select text on the screen to mark");
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
  showSuccess("Scribblet created successfully!");
}

var toggleScribblets = function(){
	var warning = false;
	if(scribbletsArray){
	  if(scribbletsVisible == true){
			try{
				highlighter.removeAllHighlights();
			}catch(err){}
	  }else{
		  for(var i = 0; i < scribbletsArray.length; i++){
			  scribblet = scribbletsArray[i];
				try{
				  range = rangy.deserializeSelection(scribblet.serialize_range);
					highlighter.highlightSelection(highlightClassName, range);
				}catch(err){
				  warning = true;
				}
			}
	  }
  }
  scribbletsVisible = !scribbletsVisible
	if(warning == true){
		showWarning("Unable to highlight some scribblets.", true);
	}
}

var loadScripplets = function(scribblets){
	scribbletsArray = scribblets
  showCount(scribblets.length);
}

function initializeScripplet(){
	if(!initialized){
		initialized = true;
		var root = location.protocol + '//' + location.host;
		var title = document.title
		windowProxy.post({'action': 'initialize', 'url':root, 'pageTitle':title, 'pageUrl':location.pathname});
	}
}

/** Message Communication Methods **/
function buildProxy(){
	// Create a proxy window to send to and receive
  // messages from the iFrame
  windowProxy = new Porthole.WindowProxy(embed_url, 'sticker-embed');

  // Register an event handler to receive messages;
  windowProxy.addEventListener(onMessage);

	//try to intialize scripplets after timeout
	setTimeout( initializeScripplet, 2000 );
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
		case 'toggle-scribblets':
			toggleScribblets();
			break;
	}
    /*
   messageEvent.origin: Protocol and domain origin of the message
   messageEvent.data: Message itself
   messageEvent.source: Window proxy object, useful to post a response
   */
}
