"use strict";

var loger = (function() {

  return (function(docFrg) {

    var logWin;

    function init() {

      var frg, p,d,s;
      var doc = document;

      if (API.isHostMethod(window, 'postMessage')) {
        logWin = window.open("log.html", "logingWindow", "width=620px,height=420px,menubar=no,resizable=no,scrollbars=no,titlebar=yes,toolbar=no");
      }

      frg = document.createDocumentFragment();

      p = doc.createElement("div");
      p.id = "status_div";
      p.setAttribute("style", "width:600px; height:400px; border:solid black 1px;");
      p.style.display = 'none';
      frg.appendChild(p);

      d = doc.createElement("div");
      d.setAttribute("class", "sectionHeader");
      p.appendChild(d);

      s = doc.createElement("span");
      s.setAttribute("style", "float:left;");
      s.innerHTML = 'STATUS: <span id="timeinfo">Time: Not  yet rendered.</span>';
      d.appendChild(s);

      s = doc.createElement("span");
      s.setAttribute("style", "float:right;");
      s.setAttribute("class", "sectionViewControls");
      d.appendChild(s);

      // messages go here
      d = doc.createElement("div");
      d.id = "log_div";
      d.setAttribute("style", "overflow:auto; width:600px; height:400px;");
      p.appendChild(d);

      s = doc.createElement("pre");
      s.id = "log";
      d.appendChild(s);

//      if (configData.useForUi) {
//        configData.useForUi.appendChild(frg);

//      } else {
        doc.getElementsByTagName("body")[0].appendChild(frg);
//      }
      s.appendChild(docFrg);
      docFrg = s;

    };

    function logMsg(s, msgType) {
  //    if (!configData.logging) {return;}
      if (typeof s === "object") { // Yes, it catches arrays.  That is good.
        s = JSON.stringify(s, undefined, 2);

      }
      
      if (logWin) {
        // I can't find a better way to check for IE's broken handling of
        // postMessage.
        try {
          logWin.postMessage(s, "*");
        } catch(err) {
          if (logWin) {logWin.close();}
          logWin = undefined;
          logMsg(s, msgType);
        }        
      } else {

        var e1 = document.createElement("div");
        var t = document.createTextNode(s);
        e1.setAttribute("style", "border: solid 1px black;");
        e1.appendChild(t);
        docFrg.appendChild(e1);
      }
    };


    function status(s) {
      logMsg(s,"log");
    };

    function log(s) {
      logMsg(s,"log");
    };

    function info (s) {
      logMsg(s,"info");
    };

    function error (s) {
      logMsg(s,"error");
    };

    return {
      init: init,
      status: status,
      info: info,
      error: error,
      log: log
    };

  });

}());

var loger = loger(document.createDocumentFragment());
var logit = loger.log;


/*


var o = document.getElementsByTagName('iframe')[0];
o.contentWindow.postMessage('Hello world', 'http://highlanddots.org/');

window.addEventListener('message', receiver, false);
function receiver(e) {
  if (e.origin == 'http://highlanddots.com') {
    if (e.data == 'Hello world') {
      e.source.postMessage('Hello', e.origin);
    } else {
      alert(e.data);
    }
  }
}




if (window.addEventListener) {
  // For standards-compliant web browsers
  window.addEventListener("message", displayMessage, false);
}
else {
  window.attachEvent("onmessage", displayMessage);
}
*/