"use strict";

function HDotsLoader() {
  var i;

  var jsScripts = [
    "tools.js",
    "mylib.js",
    "hdots.js",
    "gui.js",
    "bwwimport.js",
    "scoreelement.js",
    "mom.js",
    "note.js",
    "melody.js",
    "timesig.js",
    "staffcontrol.js",
    "embellishment.js",
    "graphicelement.js",
    "beamgroup.js",
    "phrasegroup.js",
    "metadata.js",
    "imagemap.js",
    "beautifyscore.js",
    "manager.js"
  ];



  this.include = function(jsFile) {
    var he = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('src', jsFile);
    he.appendChild(js);
  }

  for (i=0; i< jsScripts.length; i++) {
    include(jsScripts[i]);
  }

  return this;

};

var HDL = HDotsLoader();