"use strict";

var scriptLoader = (function HDotsLoader() {
  var hdotsScripts = [
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
  ];

  var hdotsPlugins = [
  ];

  var hdotsComponents = [
    "fileopener.js"
  ];

  var include = function(jsFile) {
    var he = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('src', jsFile);
    he.appendChild(js);
  };

  var load = function(scripts) {
    var i;
    for (i=0; i< scripts.length; i++) {
      include(scripts[i]);
    }
  };



  return (function() {
    return {
      loadHDots: function() {
        load(hdotsScripts);
        load(hdotsPlugins);
        load(hdotsComponents);

      },
      loadScript: function(script) {
        include(script);
      }
    }

  });


}())();

