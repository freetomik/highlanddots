"use strict";

function Score(){
  this.data = [];
}

Score.prototype = {
    appendNode: function(mel) {
      this.data.push(mel);
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
    }
};
var score = new Score();

Score.prototype.buildCollections = function() {
  var c = {}; // Collections
  var i, l = this.data.length;
  var mel;
  c.notes = [];
  c.melodyNotes = [];
  c.graceNotes = [];
  
  function pushGroup(dest, src) {
    var i;
    for (i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  }
  
  for (i = 0; i < l; i++) {
    mel = this.data[i];
    
    if (mel.type === "egrp") {
      pushGroup(c.notes, mel.notes);
      pushGroup(c.graceNotes, mel.notes);
    }
    
    if (mel.type === "melody") {
      c.notes.push(mel);
      c.melodyNotes.push(mel);
    }
  }
  this.collections = c;
}