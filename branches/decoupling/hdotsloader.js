"use strict";

function HDotsLoader() {
  var i;

  var ieJsScripts = [
    "jslib/excanvas.js"
  ];
  var wkJsScripts = [
  ];
  var mozScripts = [
  ];

  var jsScripts = [
    "jslib/canvas.text.js",
    "jslib/helvetiker-normal-normal.js",
    "jslib/helvetiker-bold-normal.js",
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

  var jsPlugins = [
  ];

  var jsComponents = [
//    "fileopener.js"
  ];


  this.include = function(jsFile) {
    var he = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('src', jsFile);
    he.appendChild(js);
  }

//  for (i=0; i< jsScripts.length; i++) {
//    include(ieJsScripts[i]);
//  }
//  for (i=0; i< wkScripts.length; i++) {
//    include(wkJsScripts[i]);
//  }
//  for (i=0; i< mozScripts.length; i++) {
//    include(mozJsScripts[i]);
//  }


  for (i=0; i< jsScripts.length; i++) {
    include(jsScripts[i]);
  }
  for (i=0; i< jsPlugins.length; i++) {
    include(jsPlugins[i]);
  }
  for (i=0; i< jsComponents.length; i++) {
    include(jsComponents[i]);
  }


  return this;

};

var HDL = HDotsLoader();