"use strict";

function beautifyScore(score) {
	/*
	We are going to switch from floating point math to integer math
	to keep calculations sane and simple.
	
	A 1/32 note is the shortest note we'll find in bagpipe music, so
	multiply all of our beat information by 100000.  This keeps us
	well within the range of integer numbers Javascript can handle.
	
	If we ever need smaller note lengths, this section will need reworked.
	*/
	
	var beatFix = 100000;
	
	// FIXME: This number pulled out of thin air.  It should come from the timesig.
	var beatInPixels = 50;  
	
	var beatUnit;	// What length note takes one beat...
	var beatCount = -1; // Count up parts of a beat...
	var dir;
	
	var beatFraction;
  
  var beatWidth;
  var w;
  
  var lastx;
  
  
  var lastMel;	
	score.data.forEach(function(mel) {
			switch(mel.type) {
			case "melody":
				if (lastMel) {
          
          dir = lastMel.duration;
          lastMel.beatFraction = beatUnit/lastMel.duration; 
          if (lastMel.dotType === "dot") {
            lastMel.beatFraction *= 1.5;
          }
          if (lastMel.dotType === "doubledot") {
            lastMel.beatFraction *= 1.75;
          }
          
          // mel.beatLength = Math.round(mel.beatFraction *beatFix);
          
          beatWidth = (beatInPixels * lastMel.beatFraction); 
          lastx = lastMel.c.x + lastMel.rect.width + lastMel.paddingRight;
          
          w = mel.c.x - lastx; 
          lastMel.paddingRight +=  beatWidth - w;
          //logit(["Beauty " + mel.note + ":" + mel.duration ,  beatWidth, mel.beatFraction, lastMel.paddingRight, beatWidth, w]);
          
        }
        lastMel = mel;
        break;
        
      case "timesig":
        beatUnit = mel.beatUnit; 
        //logit(["Beauty Beat Unit", beatUnit]);
        break;
      }
      
      if (mel.staffEnd) {
        // Last element on the line -- no need for padding.
        mel.paddingRight = 0;
        lastMel = undefined;
      }
      
  }
  );
}

