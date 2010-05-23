"use strict";

function ScoreElement() {
  this.isPrintable = false;
  this.paddingRight = staff.details.space/2;
  return this;  
}

ScoreElement.prototype.elementList = {}; 

function meldObjectToObject(src, dest, type) {
  var s;
  for (s in src) {
    if (src.hasOwnProperty(s)) {
      dest[s] = src[s];
      if (typeof type !== "undefined") {
        dest[s].type = type;
      }
    }
  }
}

Score.prototype.createNullElement = function() {
  return new ScoreElement();
};

