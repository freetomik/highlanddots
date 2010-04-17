"use strict";

function Score(){
  this.data = [];
}

Score.prototype = {
    appendNode: function(mel) {
      if (mel instanceof Array) {
	var o;
	for (o in mel) {
          this.data.push(mel[o]);
        }	
      } else {
        this.data.push(mel);
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
    }
};
var score = new Score();

Score.prototype.buildCollections = function() {
  var c = {}; // Collections
  var i, l = this.data.length;
  var mel;
  var beamGroup;
  var inBeam;
  var endBeam;
  
  c.notes = [];
  c.melodyNotes = [];
  c.graceNotes = [];
  c.beams = [];
  
  
  function pushGroup(dest, src) {
    var i;
    for (i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  }
  
  inBeam = false;
  endBeam = false;
  for (i = 0; i < l; i++) {
    mel = this.data[i];
    
//TJM
//    if (mel.type === "egrp") {
//      pushGroup(c.notes, mel.notes);
//      pushGroup(c.graceNotes, mel.notes);
//    }

    if (mel.type === "embellishment") {
      c.notes.push(mel);
      c.graceNotes.push(mel);
    }
    
    if (mel.type === "melody") {
      c.notes.push(mel);
      c.melodyNotes.push(mel);
    }
    
    // This whole beam code is patterned, of course, after the BWW format.
    // Eventually, I'd love to see the option to fix beaming and group
    // noting based on beat count.
    
    if (mel.grouped) {
      if (!inBeam) {beamGroup = [];}
      inBeam = true;
      beamGroup.push(mel);
      mel.beamGroup = beamGroup;
    }

    if (mel.type === "beat" && inBeam || !mel.grouped && inBeam) {
      c.beams.push(beamGroup);
      inBeam = false;
    }
    
  }
  this.collections = c;
}