"use strict";

function ScoreElement() {
  this.isPrintable = false;
  this.c = {};                  // Storage area for some commonly used calcuations.
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

