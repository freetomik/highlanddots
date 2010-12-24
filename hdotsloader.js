"use strict";

var scriptLoader = 
(
 function HDotsLoader() 
 {
   var hdotsScripts = [
     "jslib/canvas.text.js",
     "jslib/helvetiker-normal-normal.js",
     "jslib/helvetiker-bold-normal.js",
     "jslib/helvetiker-normal-italic.js",
     "logit.js",
     "tools.js",
     "mylib.js",
     "hdots.js",
     "gui.js",
     "bwwimport.js",
     "mom.js",
     "scoreelement.js",
     "keysig.js",
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
     "postimport.js",
     "scoretoaudio.js",
     "jslib/jsmidi/midi.js",
     "examples.js",
     "xsplitter.js"
   ];
   
   var hdotsPlugins = [
   ];
   
   var hdotsComponents = [
     "fileopener.js",
   ];
   
   var include = function(jsFile) {
     /*
     var he = document.getElementsByTagName('head').item(0);
     var js = document.createElement('script');
     js.src = jsFile;
     js.type = "text/javascript";
     he.appendChild(js);    
     */
     
     document.write("<script src='" + jsFile + "' type='text/javascript'><\/script>");
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

