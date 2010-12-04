"use strict";

function Score(){
  this.data = [];
}

Score.prototype = {
  removeAllNodes: function() {
    this.data = [];
  },
  appendNode: function(mel) {
    var i,l, o;
    if (mel instanceof Array) {
      for(i = 0, l = mel.length; i < l; i++) {
        o = mel[i];
        o.scoreIndex = this.data.length-1
        this.data.push(o);
        mel.scoreIndex = this.data.length-1;
      }	
    } else {
      this.data.push(mel);
      mel.scoreIndex = this.data.length-1;
    }
  },
  getLastElementByType: function(type) {
    var i = 0, l = this.data.length;
    var mel;
    for (i = 0; i < l; i++) {
      mel = this.data[l-i];
      if (mel && mel.type === type) {
        return mel;
      }
    }
  },
  getNextElementByType: function(type) {
    var i = 0, l = this.data.length;
    var mel;
    for (i = 0; i < l; i++) {
      mel = this.data[i];
      if (mel && mel.type === type) {
        return mel;
      }
    }
  }
  
};
var score = new Score();


Score.prototype.find = function(mel) {
  var i = -1;
  if (mel.scoreIndex) {
    i = mel.scoreIndex;
  } else {
    var j = 0;
    var l = this.data.length;
    var o;
    for (j = 0; j < l; j++) {
      if (mel == this.data[j]) {
        mel.scoreIndex = j;
        i = j;
        break;
      }
    }
  }
  return i;
  
};

Score.prototype.get = function(scoreIndex) {
  return (this.data[scoreIndex]);
}
