"use strict";

function ScoreElement() {
  var self=this;
  this.isPrintable = false;
  return this;  
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

