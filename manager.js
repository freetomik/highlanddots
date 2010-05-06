"use strict";

function HDManager() {  

  var self = this;

  var uiElems = { 
    document : null,
    canvas : null,
    editor : null,
    log : null,
    status: null
  };

  this.core = {
      plugins     : [],
      components  : [],

      loadTune : function(type, tuneTxt) { loadTune(type, tuneTxt); },
      loadInternalTestTune : function() {
                               var startTime = new Date();
                               testImport(); 
                               var endTime = new Date();
                               var total = (endTime - startTime) / 1000;
                               ui.setText('status', "Time spent rendering: " + total + " seconds.");
                             }

  };
  
  this.ui = {
      plugins     : [],
      components  : [],

      setDocument : function(obj) { uiElems.document = obj; },
      getDocument : function()    { return uiElems.document; }, 
      setCanvas   : function(obj) { uiElems.canvas = obj; },
      getCanvas   : function()    { return uiElems.canvas; }, 
      setEditor   : function(obj) { uiElems.editor = obj; },
      getEditor   : function()    { return uiElems.editor; }, 
      setLog      : function(obj) { uiElems.log = obj; },
      getLog      : function()    { return uiElems.log; }, 
      setStatus   : function(obj) { uiElems.status = obj; },
      getStatus   : function()    { return uiElems.status; }, 

      setStyle  :   function(elemName, attrib, val) {
		      uiElems[elemName].style[attrib] = val;
		    },
      getStyle  :   function(elemName, attrib, val) {
		      return uiElems[elemName].style[attrib];
		    },

      clear     :   function(elemName) {
		      if (elemName === "canvas") {
			var ctx = uiElems.canvas.ctx;
			ctx.fillStyle = "#0c0";
			ctx.fillRect(0, 0, uiElems.canvas.width, uiElems.canvas.height);

		      } else if (elemName === "editor") {
			uiElems.editor.value = "";

		      } else if (elemName === "log") {
			uiElems.log.innerHTML = "";

		      } else if (elemName === "status") {
			uiElems.status.innerHTML = "";

		      }
		    },


      setText   :   function(elemName, txt) {
		      if (elemName === "editor") {
			uiElems.editor.value = txt;

		      } else if (elemName === "log") {
			this.clear("log");
			uiElems.log.appendChild(document.createTextNode(txt));

		      } else if (elemName === "status") {
			this.clear("status");
			uiElems.status.appendChild(document.createTextNode(txt));

		      }
		    },

      appendText :  function(elemName, txt) {
		      if (elemName === "editor") {
			uiElems.editor.value += txt;

		      } else if (elemName === "log") {
			uiElems.log.appendChild(document.createTextNode(txt));

		      } else if (elemName === "status") {
			uiElems.status.appendChild(document.createTextNode(txt));

		      }
		    },

      registerComponent   :  function (ci) {
		      this.components.push(ci);
		      // FIXME : put into array so that it can slected at runtime
		      this[ci.identifier] = ci;
		    },

      initPlugins : function () {
			var i;

			for (i=0; i<this.plugins.length; i++) {
			  // FIXME : init with 'completed, staus' callback 
			  if (this.plugins[i]['init'] !== undefined) {
			    this.plugins[i]['init']();
			  }
			}
		    },
      initComponents : function () {
			var i;

			for (i=0; i<this.components.length; i++) {
			  // FIXME : init with 'completed, staus' callback 
			  if (this.components[i]['init'] !== undefined) {
			    this.components[i]['init']();
			  }
			}
		    }
  };

  var logit = function(obj) {
    if (!uiElems.log) return;
    if (!staff.details.logging) return;
    
    if (typeof obj === "object") { // Yes, it catches arrays.  That is good.
      obj = JSON.stringify(s, undefined, 2);
    }
    
    this.ui.appendText("log",obj);
  };


  return this;
}

var HD = HDManager();