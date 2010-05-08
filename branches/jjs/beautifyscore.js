"use strict";

hdots_prefs.registerPlugin("beauty_engine", "beat", "To the beat", beautifyScore);

hdots_prefs.registerPluginPreference("beauty_engine", "beat",
                                     {
                                     type: "text",
                                     label: "Length of line, in pixels",
                                     name: "linelen",
                                     def:  "2000"
                                     });



hdots_prefs.registerPlugin("beauty_engine", "natural", "The natural layout", dummy);
function dummy(pref, score) {
}


function beautifyScore(pref, score) {
  var FORCEWIDTH = +pref.linelen; //2000;   // Forced for now.  It is the width of the the bar, minus "headers" 
  
  
  var i, l, data;
  var mel, mel2, measureList, melodyNoteList;
  var lastBarMel;
  var measureNumber;
  var lineNumber, lineMeasureNumber;
  var beatUnit, beatsPerBar;
  var maxMeasuresInLine = 0;
  var beatCount = 0;
  var beatCountOnLine = 1;
  var t, tmp;
  
  data = score.data;
  l = data.length;
  
  measureList = [];
  melodyNoteList = [];
  measureNumber = 0;
  lineNumber = 1;
  lineMeasureNumber = 0;
  
  
  
  /*
  Pass  1:
  
  Loop through all of the mels in order.
  Save off the time signature every time it changes, we use that to calcuate
  beat size and things.
  
  Then, for each melody note, calcuate the actual duration of that note,
  
  Count up the number of beats and squirrel them away.  For any measure
  that has less than the proper beats per measure, set a isLeadIn.
  
  This is used later
  */
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
      mel.b.beatCountOnLine = beatCountOnLine;
      beatCountOnLine += t;
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
        
        if (beatCount !== beatsPerBar) {
          if (lineMeasureNumber === 0) {
            lastBarMel.b.isLeadIn = true;
          } else {
            lastBarMel.b.isLeadOut = true;
          }
        }
        
        lineMeasureNumber++;
        lastBarMel.b.str = lineNumber + ":" + lineMeasureNumber;
        lastBarMel.b.lineNumber = lineNumber;
        lastBarMel.b.lineMeasureNumber = lineMeasureNumber;
        lastBarMel.b.beatsPerBar = beatsPerBar;
        lastBarMel.b.measureNumber = measureList.length;
        lastBarMel.b.beatWeight = beatCount;
        maxMeasuresInLine = Math.max(maxMeasuresInLine, lineMeasureNumber);
        beatCount = 0;
        measureList.push(tmp);
      }
      melodyNoteList = [];
      lastBarMel = mel;
      
      if (mel.staffEnd) {
        lineNumber++;
        lineMeasureNumber = 0;
        beatCountOnLine = 1;
      }
    }
  }
  
  /* Debugging, can be dropped later */  
  function dumpNotes(a) {
    var o;
    var i;
    var mel;
    var s = [];
    for (i = 0; i < a.length; i++) {
      s.push(a[i].bww);
    }
    return s.join(" ");
  }
  
  
  /* Here is were the real work is done.  We set the spaing for each note
  based on various factors, including the length of each note, the number
  of measures in a bar (not counting leadins) and the like.
  */
  function setSpacing() {
    //FIXEME: Should be based off scaling.
    var spaceForLeadIn = 0;  // How much space to reserve for lead ins.
    
    var BEATLENGTH;
    
    var idx = 0;
    var len = data.length;
    var a;
    var mel, prevMel, staffMel;
    var newX;
    
    // Find the next start of a measure bar.
    // Sometimes there are measure bars with no melody notes inside, such
    // as when a bar starts off the beginning of a line, then a repeat bar
    // shows up after the time sig.  Basicly, any melody bar that indicates
    // it has beats.
    function getMeasureStart() {
      var mel;
      while (idx < len) {
        mel = data[idx];
        idx++;
        if (mel.newBar && mel.b.beatWeight) {return mel; }
      }
    }
    
    // And read off the melody notes to the end of the line.  Also return
    // the number of measures in this line for later calculation.
    function getLineData() {
      var mel;
      var a = [];
      var i;
      var m = 0;
      
      while (idx < len) {
        mel = data[idx];
        idx++;
        if (mel.type === "melody") {a.push(mel);}
        if (mel.newBar) {m++;}
        
        if (mel.staffEnd) {idx--; break;}
      }
      return {
        a: a,
        m:m
      };
    }
    
    
    // This sets a mel's position as fixed.  It is used by the drawing 
    // routine to forceably set the note position and work from there.
    function setFixedPosition(mel, toX) {
      mel.forceToX = toX;
      //prevMel.paddingRight = 0;
    }
    
    // There are some things that should be immune from being forced.
    // Things like the clef, key signatures, time signatures.
    // Also, the leadins are left alone.
    // 
    // But we do measure the length of the longest lead in and set the
    // spaceForLeadIn to that.
    (function() {       
     var inLeadIn = false;
     var isMeasureStart = true;
     var getNextMelodyX = false;
     
     isMeasureStart = true;
     l = data.length;      
     for (i = 0; i < l; i++) {
       mel = data[i];
       if (!mel.c) {continue;}
       
       if (mel.b && mel.b.isLeadIn) {
         inLeadIn = true;
         getNextMelodyX = true;
       } else if (mel.newBar) {
         inLeadIn = false;
       }
       
       if (inLeadIn) {
         mel.noForceX = true;
       } else {
         
         if (mel.type === "melody") {
           if (getNextMelodyX) {
             if (mel.c && typeof mel.c.x === "number") {spaceForLeadIn = Math.max(spaceForLeadIn, mel.c.x)};
             getNextMelodyX = false;
           }
           
           isMeasureStart = false;
         }
         if (inLeadIn) {mel.noForceX = true};
         if (mel.type === "embellishment") { isMeasureStart = false; }
         if (mel.staffEnd) { isMeasureStart = true;}
         if (isMeasureStart) { mel.noForceX = true;}
       }
     }
     
    }());
    
    var offSet;
    var m;
    // Start collecting data
    while (((staffMel = getMeasureStart()) !== undefined)) {
      // Get the info for this linei of music.
      a = getLineData();
      m = a.m; // The number of measures
      a = a.a; // and the melody note list.
      
      // If the first measure is a lead in, don't count it towards the nummber
      // of measures.
      if (staffMel.b && staffMel.b.isLeadIn) {m--;}
      //logit(dumpNotes(a));
      
      // Set the width of each beat in pixels.
      BEATLENGTH = FORCEWIDTH/(staffMel.b.beatsPerBar*m);
      offSet = spaceForLeadIn;
      
      // Run through the melody notes on the line.
      for (i = 0; i < a.length; i++) {
        mel = a[i];
        if (mel.noForceX) {continue;}  // Some of them are to be left alone.
        
        newX = offSet;                 // The position for this note
        offSet += BEATLENGTH * mel.b.beatWeight; // And for the next note..
        setFixedPosition(mel, newX);
      }      
    };
    
    
    // Now, we walk through the data once more -- backwards.
    // And we shift most of the other mel's around to slide back in front
    // of the melody note they are attached to.
    l = data.length;      
    var offSet = 0;
    for (i = 0; i < l; i++) {
      mel = data[l-i];
      
      if (!mel) {continue;}
      if (!mel.c) {continue;}      
      
      if (mel.type === "melody") {
        isMeasureStart = false;
        mel2 = mel;
        offSet = mel.c.x - mel.forceToX;        
      } else  {
        //logit(mel.type + " offset = " + offSet);
        if (!mel.noForceX) { 
          mel.forceToX = mel.c.x - offSet;
        }
      }
      
      if (mel.staffEnd) { mel.forceToX  = FORCEWIDTH + spaceForLeadIn;}
    }
  }
  
  setSpacing();
}


hdots_prefs.registerPlugin("beauty_engine", "old", "Testing Style", beautifyScore2);

/*  hdots_prefs.registerPluginPreference("beauty_engine", "old",
{
type: "text",
label: "Length of line, in pixels",
name: "linelen",
def:  "2000"
});
*/




function beautifyScore2(pref, score) {
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


  // The smallest unit of sound that is ever used is a 1/128th note.
  // In decimal:  1 / 128 = 0.0078125
  
  
  
  // FIXME: This number pulled out of thin air.  It should come from the timesig.
  var beatInPixels = 200;  
  
  var beatUnit; // What length note takes one beat...
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
                         
                         //logit(["Beauty " + mel.note + ":" + mel.duration ,  beatWidth, mel.beatFraction, lastMel.paddingRight, beatWidth, w]);
                         
                       }
                       lastMel = mel;
                       break;
                       
                     case "timesig":
                       beatUnit = mel.beatUnit; 
                       //logit(["Beauty Beat Unit", beatUnit]);
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

