"use strict";


var BASEPULSE = 78125;
var beatFixRate = {
  128: 1 * BASEPULSE,
  64: 2 * BASEPULSE,
  32: 3 * BASEPULSE,
  16: 4 * BASEPULSE,
  8: 8 * BASEPULSE,
  4: 16 * BASEPULSE,
  2: 32 * BASEPULSE,
  1: 64 * BASEPULSE
};


function beautifyScore(score) {
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

