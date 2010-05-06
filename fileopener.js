"use strict";
/*
function localPathToURI(path) {
  var uri = path;
  uri = uri.replace(/\\/g, '/');
  uri = uri.replace(/:/g, '|');
  uri = "file://" + uri;
  return uri;
}
*/

function FFFileOpenerComponent() {

        var self = this;

	this.register = function() {
	  HD.ui.registerComponent(this.componentInfo);
	};

	this.init = function(domInfo) {
	  //no-op
	};

	this.onShown = function(domInfo) {
	  //no-op
	};

	this.onHidden = function(domInfo) {
	  //no-op
	};

	this.openHttpFile = function(uri) {
	  // TODO
	};

	this.openLocalFile = function(fileList) {
          var startTime = new Date();
	  var t = fileList[0].getAsText("");
	  
	  HD.ui.setText('editor', t);
	  HD.core.loadTune('bww', t);
          
          var endTime = new Date();
          var total = (endTime - startTime) / 1000;
          HD.ui.setText('status', "Time spent rendering: " + total + " seconds.");

	};



	this.getContent = function(domInfo) {
	  var divElem, elem, inputElem;
	  var doc = domInfo.doc;
	  var parent = domInfo.parentNode;

	  if (this.uiElement === undefined) {
	    divElem = doc.createElement('div');

	    elem = doc.createElement('fieldset');
	    divElem.appendChild(elem)
	    elem.appendChild(doc.createElement('legend'));
	    elem.childNodes[0].appendChild(doc.createTextNode("HTTP"));

	    inputElem = doc.createElement('input');
	    inputElem.setAttribute('type', 'text');
	    inputElem.setAttribute('size', '40');
	    inputElem.setAttribute('value', 'http://');
	    elem.setAttribute('onChange', "HD.ui.FileOpener.instance.openHttpFile(this.value);");
	    elem.appendChild(inputElem);

	    elem = doc.createElement('fieldset');
	    divElem.appendChild(elem)
	    elem.appendChild(doc.createElement('legend'));
	    elem.childNodes[0].appendChild(doc.createTextNode("Files"));

	    inputElem = doc.createElement('input');
	    inputElem.setAttribute('type', 'file');
	    inputElem.setAttribute('size', '30');
	    inputElem.setAttribute('onChange', "HD.ui.FileOpener.instance.openLocalFile(this.files);");
	    elem.appendChild(inputElem)

	    this.uiElement = divElem;
	  }
	  return (this.uiElement);

	};
	
  this.componentInfo = {
	    instance : self, 
	    category: "ui",
	    type: "component",
	    identifier: "FileOpener",
	    os: "any",
	    browser: "mozilla",
	    title: "Open File",
	    desc: "Firefox File opener",
	    init: self.init,
	    getContent : self.getContent,
	    show: self.onShown,
	    hide: self.onHidden
  };

  return this;
};


function IEFileOpenerComponent() {
	var self = this;

	this.register = function() {
	  HD.ui.registerComponent(this.componentInfo);
	};

	this.init = function(domInfo) {
	  //no-op
	};

	this.onShown = function(domInfo) {
	  //no-op
	};

	this.onHidden = function(domInfo) {
	  //no-op
	};

	this.openHttpFile = function(uri) {
	  // TODO
	};

	this.openLocalFile = function() {

          var dialog = new ActiveXObject('UserAccounts.CommonDialog');
          dialog.Filter = 'All files (*.*)|*.*| ';
          var result = dialog.ShowOpen();
          if (result == 0 )
           return false;

          var fso = new ActiveXObject("Scripting.FileSystemObject");
          var f = fso.OpenTextFile(dialog.FileName, 1, false); // open for reading, don't create it
          var txt = f.ReadAll();
	  
          var startTime = new Date();
	  HD.ui.setText('editor', txt);
	  HD.core.loadTune('bww', txt);

	  var endTime = new Date();
	  var total = (endTime - startTime) / 1000;
	  HD.ui.setText('status', "Time spent rendering: " + total + " seconds.");

	};



	this.getContent = function(domInfo) {
	  var divElem, elem, inputElem;
	  var doc = domInfo.doc;
	  var parent = domInfo.parentNode;

	  if (this.uiElement === undefined) {
	  
	    divElem = doc.createElement('div');

	    elem = doc.createElement('fieldset');
	    divElem.appendChild(elem)
	    elem.appendChild(doc.createElement('legend'));
	    elem.childNodes[0].appendChild(doc.createTextNode("HTTP"));

	    inputElem = doc.createElement('input');
	    inputElem.setAttribute('type', 'text');
	    inputElem.setAttribute('size', '40');
	    inputElem.setAttribute('value', 'http://');
	    inputElem.setAttribute('onChange', "HD.ui.FileOpener.instance.openHttpFile(this.value);");
	    elem.appendChild(inputElem);

	    elem = doc.createElement('fieldset');
	    divElem.appendChild(elem)
	    elem.appendChild(doc.createElement('legend'));
	    elem.childNodes[0].appendChild(doc.createTextNode("Files"));

	    inputElem = doc.createElement('button');
	    inputElem.setAttribute('value', 'Browse Files');
            inputElem.onclick = function() { HD.ui.FileOpener.instance.openLocalFile(); };
            inputElem.appendChild(doc.createTextNode('Browse Files'));

	    elem.appendChild(inputElem)

	    this.uiElement = divElem;
	  }
	  return (this.uiElement);

	};
	
  this.componentInfo = {
	    instance : self, 
	    category: "ui",
	    type: "component",
	    identifier: "FileOpener",
	    os: "win32",
	    browser: "ie",
	    title: "Open File",
	    desc: "IE File opener",
	    init: self.init,
	    getContent : self.getContent,
	    show: self.onShown,
	    hide: self.onHidden
  };

  return this;
};


//if (location.href.lastIndexOf(".hta")) {
//  IEFileOpenerComponent().register();
//} else {
  FFFileOpenerComponent().register();
//}
