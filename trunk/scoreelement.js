"use strict";

function ScoreElement() {
  var self=this;
  this.isPrintable = false;
  
  this.getTypeOf = function(a) {
    
    var s = self.elementList[a];
    if (!s) {
      return "undefined";
    } else {
      return s.type;
    }
  };
}

ScoreElement.prototype.elementList = {}; 

function meldObjectToObject(src, dest, type) {
  var s;
  for (s in src) {
    if (src.hasOwnProperty(s)) {
      dest[s] = src[s];
      dest[s].type = type;
    }
  }
}

