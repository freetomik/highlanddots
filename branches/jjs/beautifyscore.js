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
  
  
  l = measureList.length;  
  var ss,j;
  for (i = 0; i < l; i++) {
    tmp = measureList[i];
    
    if (0) {  // Debugging
      ss = "";
      for (j = 0; j < tmp.melodyNoteList.length; j++) {
        mel = tmp.melodyNoteList[j];
        ss += " " + mel.bww;
        beatCount += mel.b.beatWeight;
      }
    }
   
    if (tmp.beatCount !== tmp.beatsPerBar) {
    //logit(["Measure: " + i, "BC: have " + tmp.beatCount + "(need " + tmp.beatsPerBar + ")", ss, tmp.melodyNoteList.length]);
    }
    }
  
  
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
  
    function setSpacing() {
      var FORCEWIDTH = 2000;
      var FORCELEFT = 150;
      var BEATLENGTH;
      
      var idx = 0;
      var len = data.length;
      var a;
      var mel, prevMel, staffMel;
      var newX;
      
      function getMeasureStart() {
        var mel;
        while (idx < len) {
          mel = data[idx];
          idx++;
          if (mel.newBar && mel.b.beatWeight) {return mel; }
        }
      }
      
      function getLineNotes() {
        var mel;
        var a = [];
        var i;
        
        while (idx < len) {
          mel = data[idx];
          idx++;
          if (mel.type === "melody") {a.push(mel);}
          if (mel.staffEnd) {idx--; break;}
        }
        return a;
      }
      
      
      function adjustPadding(prevMel, mel, toX) {
        mel.forceToX = toX;
        prevMel.paddingRight = 0;
        var diff = toX - mel.c.x;
        //alert([toX, mel.c.x, diff]);
        //prevMel.paddingRight += diff;
      }
      
      var offSet;
      // Start collecting data
      while (((staffMel = getMeasureStart()) !== undefined)) {
          BEATLENGTH = FORCEWIDTH/(staffMel.b.beatsPerBar*maxMeasuresInLine);
        offSet = FORCELEFT;
        
        a = getLineNotes();
        logit(dumpNotes(a));
        
        for (i = 0; i < a.length; i++) {
          mel = a[i];
          if (i === 0) {
            prevMel = data[data.indexOf(mel)-1];
          } else {
            prevMel = a[i-1];
          }
          
          //alert(prevMel);
          
          newX = offSet;
          offSet += BEATLENGTH * mel.b.beatWeight;
          adjustPadding(prevMel, mel, newX);
          mel.b.newX = newX;
          
          //logit(["DB1", FORCELEFT, staffMel.b.str, mel.bww, BEATLENGTH, newX]);
        }
        
        //logit(["C2", staffMel, a.length]);
        
      };
      
      // Walk throughbackwards and adjust things.
      
      var offSet = 0;
      for (i = 0; i < l; i++) {
        mel = data[l-i];
        
        //if (mel.type === "embellishment") {
          alert(mel.bww + " " + typeof mel.length);
        //}
        
        if (!mel.c) {continue;}      
        if (mel.type === "melody") {
          mel2 = mel;
          offSet = mel.c.x - mel.forceToX;
        } else if (mel.type === "embellishment"){
          alert(mel.toSource());
          
        } else  {
          logit(mel.type + " offset = " + offSet);
          mel.forceToX = mel.c.x - offSet
        }
        
        if (mel.staffEnd) {
          mel.forceToX  = FORCEWIDTH + FORCELEFT;
        }
        
      }
      
    }
    
    
    setSpacing();
    
  
  
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

