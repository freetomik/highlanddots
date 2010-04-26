"use strict";


var BASEPULSE = 78125;
var beatFixRate = {
  /*
  For right now, we are going to pretend these don't exist for melody notes 
  128: 1 * BASEPULSE,
  64: 2 * BASEPULSE,
  32: 3 * BASEPULSE,
  16: 4 * BASEPULSE,
  8: 8 * BASEPULSE,
  4: 16 * BASEPULSE,
  2: 32 * BASEPULSE,
  1: 64 * BASEPULSE
  */
  
  16: 1 * BASEPULSE,
  8: 2 * BASEPULSE,
  4: 4 * BASEPULSE,
  2: 8 * BASEPULSE,
  1: 16 * BASEPULSE
  
};




function beautifyScore(score) {
  var beatInPixels = 200;
  var i, l, data;
  var mel, mel2, measureList, melodyNoteList;
  var measureNumber;
  var beatUnit, beatsPerBar;
  var beatCount = 0;
  var t, tmp;
  
  data = score.data;
  l = data.length;
  
  measureList = [];
  melodyNoteList = [];
  measureNumber = 0;
  for (i = 0; i < l; i++) {
    mel = data[i];
    mel.b = {};
       
    switch(mel.type) {
    case "melody":
      t = beatUnit / mel.duration;
      if (mel.dotType === "dot") { t *= 1.5;  }
      if (mel.dotType === "doubledot") { t *= 1.75; }
            
      mel.b.beatWeight = t;
      beatCount += t;
      melodyNoteList.push(mel);
      //logit(["BW",mel.b.beatWeight]); 
      break;
    case "timesig":
      beatUnit = mel.beatUnit;
      beatsPerBar = mel.beatsPerBar;
      //logit(["Beauty Beat Unit", beatUnit]);
      break;
    }
 
    if (mel.newBar) {
      if (melodyNoteList.length > 0) {
        tmp = {
          melodyNoteList: melodyNoteList,
          beatCount: beatCount,
          beatsPerBar: beatsPerBar
        };
        mel.measureNumber = measureList.length;
        measureList.push(tmp);
      }
      melodyNoteList = [];
    }
    
    
    if (mel.type === "staffControl") {
      mel.b.beatWeight = beatCount;
      beatCount = 0;
    }
  }
  
  
  
  l = measureList.length;  
  var ss,j;
  for (i = 0; i < l; i++) {
    tmp = measureList[i];
    ss = "";
    for (j = 0; j < tmp.melodyNoteList.length; j++) {
      mel = tmp.melodyNoteList[j];
      ss += " " + mel.bww;
      beatCount += mel.b.beatWeight;
    }
    if (tmp.beatCount !== tmp.beatsPerBar) {
      logit(["Measure: " + i, "BC: have " + tmp.beatCount + "(need " + tmp.beatsPerBar + ")", ss, tmp.melodyNoteList.length]);
    }
  }
 
  //logit(["measurelist", measureList]);
}

function beautifyScore2(score) {
  // The smallest unit of sound that is ever used is a 1/128th note.
  // In decimal:  1 / 128 = 0.0078125
  
  
  
	// FIXME: This number pulled out of thin air.  It should come from the timesig.
	var beatInPixels = 200;  
  
	var beatUnit;	// What length note takes one beat...
	var beatCount = 0; // Count up parts of a beat...
	
	var beatFraction;
  
  var beatWidth;
  var w;
  
  var lastx;
  
  
  var lastMel;	
	score.data.forEach(function(mel) {
                     var currentBeatCount;
                     
                     switch(mel.type) {
                     case "melody":
                       if (lastMel) {
                         
                         currentBeatCount = beatFixRate[lastMel.duration];                         
                         lastMel.beatFraction = beatUnit/lastMel.duration; 
                         
                         
                         if (lastMel.dotType === "dot") {
                           lastMel.beatFraction *= 1.5;
                           currentBeatCount *= 1.5;
                         }
                         if (lastMel.dotType === "doubledot") {
                           lastMel.beatFraction *= 1.75;
                           currentBeatCount *= 1.75;
                         }
                         
                         beatWidth = (beatInPixels * lastMel.beatFraction); 
                         lastx = lastMel.c.x /* + lastMel.rect.width  + lastMel.paddingRight */;
                         
                         w = mel.c.x - lastx; 
                         lastMel.paddingRight +=  beatWidth - w;
                         
                         beatCount += currentBeatCount;
                         lastMel.beatCount = beatCount;
                         lastMel.currentBeatCount = currentBeatCount;
                         
                         logit(["Beauty " + mel.note + ":" + mel.duration ,  beatWidth, mel.beatFraction, lastMel.paddingRight, beatWidth, w]);
                         
                       }
                       lastMel = mel;
                       break;
                       
                     case "timesig":
                       beatUnit = mel.beatUnit; 
                       logit(["Beauty Beat Unit", beatUnit]);
                       break;
                     }
                     
                     if (mel.newBar) {
                       mel.beatCount = beatCount;
                       beatCount = 0;
                     }
                     
                     if (mel.staffEnd) {
                       lastMel = undefined;
                     }
                     
  }
  );
}

