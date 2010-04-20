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
  var mel, lastType;
  var beamGroup, inBeam, endBeam;
  var tieGroup, inTie, endTie;
  var tripletGroup, inTriplet, endTriplet;
  var voltaGroup, inVolta, endVolta;
  
  c.notes = [];
  c.melodyNotes = [];
  c.graceNotes = [];
  c.beams = [];
  c.ties = {};
  c.triplets = {};
  c.voltas = {};
  
  c.findIn = function(mel, collection) {
    var i,j,grp;
    for (i = 0; i < collection.length; i++) {
      grp = collection[i];
      for (j = 0; j <grp.length; j++) {
        if (grp[j] == mel) {
          return (grp);
        }
      }
    }
    return (null);
  };
  
  function pushGroup(dest, src) {
    var i;
    for (i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  }
  
  inBeam = endBeam = false;
  inTie = endTie = false;
  inTriplet = endTriplet = false;
  inVolta = endVolta = false;

  for (i = 0; i < l; i++) {
    mel = this.data[i];
    
    if (mel.type === "phrasegroup") {
      if (mel.name === "tie") {
        if (mel.start) {
          tieGroup = [];
          inTie = true;
        } else if (mel.end) {
          inTie = false;
          c.ties[mel] = tieGroup;
        }
      } else if (mel.name === "triplet") {
        if (mel.start) {
          tripletGroup = [];
          inTriplet = true;
        } else if (mel.end) {
          inTriplet = false;
          c.triplets[mel] = tripletGroup;
        }
      }
    }

    if (mel.type === "volta") {
      if (mel.start) {
        voltaGroup = [];
        inVolta = true;
      } else if (mel.end) {
        inVolta = false;
        c.voltas[mel] = voltaGroup;
      }
    }

    if (mel.type === "embellishment") {
      c.notes.push(mel);
      c.graceNotes.push(mel);
      if (inTie) tieGroup.push(mel);
      if (inTriplet) tripletGroup.push(mel);
      if (inVolta) voltaGroup.push(mel);
    }
    
    if (mel.type === "melody") {
      c.notes.push(mel);
      c.melodyNotes.push(mel);
      if (inTie) tieGroup.push(mel);
      if (inTriplet) tripletGroup.push(mel);
      if (inVolta) voltaGroup.push(mel);
    }
    
    // gracenote group immediately followed by melody note group
    // push beamGroup, create empty beamGroup
    // set inBeam to false so the next conditional will cat on this mel
    if (mel.grouped && mel.type != lastType) {
      if (inBeam) {
        c.beams.push(beamGroup);
        inBeam = false;
      }
    }

    // This whole beam code is patterned, of course, after the BWW format.
    // Eventually, I'd love to see the option to fix beaming and group
    // noting based on beat count.
    
    if (mel.grouped) {
      if (!inBeam) {beamGroup = [];}
      inBeam = true;
      beamGroup.push(mel);
    }

    if (mel.type === "beat" && inBeam || !mel.grouped && inBeam) {
      c.beams.push(beamGroup);
      inBeam = false;
    }

    lastType = mel.type;
    
  }
  this.collections = c;
}