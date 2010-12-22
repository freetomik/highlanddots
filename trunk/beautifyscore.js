"use strict";

(function() {
 hdots_prefs.registerPlugin("beauty_engine", "pportion3", "Proportional Layout", beautifyScore2);
 
 hdots_prefs.registerPluginPreference("beauty_engine", "pportion3",
                                      {
                                      type: "text",
                                      label: "One beat, measured in spaces",
                                      name: "beatInSpaces",
                                      def:  3.7
                                      });
 
 // Static to passOne and passTwo
 var lineMels;
 var lineCount;
 
 function IncLineData() {
   lineCount++;
   lineMels[lineCount] = [];
 }
 
 function beautifyScore2(pref, staff, pass) {
   switch(pass) {
   case 1:
     beautifyScorePassOne(pref, staff);
     break;
   case 2:
     beautifyScorePassTwo(pref, staff);
     break;
   }
 }
 
 function beautifyScorePassTwo(pref, staff) {
   var maxX = staff.details.maxX;
   var i = 0, j;
   var line;
   
   var melsThisLine;
   var lineLength;
   var padding;
   var mel;
   
   for (i = 0; i < lineCount; i++) {
     line = lineMels[i];
     
     melsThisLine = line.length;
     lineLength = line[melsThisLine-1].c.x;
     padding = (maxX - lineLength) / melsThisLine;
     
     //logit([maxX, melsThisLine, line[melsThisLine-1].toSource(), line[melsThisLine-1].c.x]);
     //logit("Padding = " + padding);
     
     for (j = 0; j < melsThisLine-1; j++) { // Don't do the staffControl
       mel  = line[j];
       mel.paddingRight += padding;
     }
   }
 } 
 
 function beautifyScorePassOne(pref, staff) {
   
   var beatInPixels = +parseFloat(pref.beatInSpaces);
   beatInPixels = beatInPixels * staff.details.space; 
   
   var beatUnit; // What length note takes one beat...
   var beatCount = 0; // Count up parts of a beat...
   
   var beatFraction;
   var beatWidth;
   var w;
   var padding;
   var lastx;
   
   lineMels = [];
   lineCount = -1; // So the new data starts at zero
   IncLineData();
   
   var lastMel; 
   score.data.forEach
   (function(mel)
    {
    if (!mel) {return;}
    
    if (mel.type === "melody" || mel.staffEnd) { // We like having the end of the staff padding out as well
      
      lineMels[lineCount].push(mel);
      
      if (lastMel) {
        beatWidth = (beatInPixels * lastMel.beatFraction); 
        lastx = lastMel.c.x /* + lastMel.rect.width  + lastMel.paddingRight */;
        
        w = mel.c.x - lastx; 
        padding = beatWidth - w;
        if (padding > 0) {
          lastMel.paddingRight +=  padding;
        }
        
        //logit(["Beauty " + mel.note + ":" + mel.duration ,  beatWidth, mel.beatFraction, lastMel.paddingRight, beatWidth, w]);
        
      }
      lastMel = mel;
    }
    
    if (mel.type === "timesig") {
      beatUnit = mel.beatUnit; 
      //logit(["Beauty Beat Unit", beatUnit]);
    }
    
    if (mel.newBar) {
      mel.beatCount = beatCount;
      beatCount = 0;
    }
    
    if (mel.staffEnd) {
      lastMel = undefined;
      IncLineData();
    }
    
    });
 }
}());



hdots_prefs.registerPlugin("beauty_engine", "beat", "To the beat", beautifyScore);

hdots_prefs.registerPluginPreference("beauty_engine", "beat",
                                     {
                                     type: "text",
                                     label: "Length of line, in pixels",
                                     name: "linelen",
                                     def:  "2000"
                                     });



hdots_prefs.registerPlugin("beauty_engine", "natural", "The natural layout", dummy);
function dummy(pref, staff) {
}


function beautifyScore(pref, staff, pass) {
  if (pass === 2) {return;}  // Second pass not needed
  
  var FORCEWIDTH = +pref.linelen; 
  
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
	var isMeasureStart;
	
  data = score.data;
  l = data.length;
	
  measureList = [];
  melodyNoteList = [];
  measureNumber = 0;
  lineNumber = 1;
  lineMeasureNumber = 0;
  
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
      if (mel.newBar && mel.measureLength && mel.beatsPerBar) {return mel; }
    }
  }
  
  // And read off the melody notes to the end of the line.  Also return
  // the number of measures in this line for later calculation.
  function getlineMels() {
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
  }
  
  // There are some things that should be immune from being forced.
  // Things like the clef, key signatures, time signatures.
  // Also, the leadins are left alone.
  // 
  // But we do measure the length of the longest lead in and set the
  // spaceForLeadIn to that.
  (function() {       
   var inLeadIn = false;
   isMeasureStart = true;
   var getNextMelodyX = false;
   
   isMeasureStart = true;
   l = data.length;      
   for (i = 0; i < l; i++) {
     mel = data[i];
     if (!mel.c) {continue;}
     
     if (mel.isLeadIn) {
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
       if (mel.type === "gracenote") { isMeasureStart = false; }
       if (mel.staffEnd) { isMeasureStart = true;}
       if (isMeasureStart) { mel.noForceX = true;}
     }
   }
   
  }());
  
  var offSet;
  var m;
  // Start collecting data
  while (((staffMel = getMeasureStart()) !== undefined)) {
    //logit(["StaffMel", staffMel]);
    
    // Get the info for this line of music.
    a = getlineMels();
    //logit(a);
    m = a.m; // The number of measures
    a = a.a; // and the melody note list.
    
    // If the first measure is a lead in, don't count it towards the nummber
    // of measures.
    if ( staffMel.isLeadIn) {m--;}
    //logit(dumpNotes(a));
    
    // Set the width of each beat in pixels.
    BEATLENGTH = FORCEWIDTH/(staffMel.beatsPerBar*m);
    offSet = spaceForLeadIn;
    
    // Run through the melody notes on the line.
    for (i = 0; i < a.length; i++) {
      mel = a[i];
      if (mel.noForceX) {continue;}  // Some of them are to be left alone.
      
      newX = offSet;                 // The position for this note
      offSet += BEATLENGTH * mel.beatFraction; // And for the next note..
      //logit(["Adjusting", staffMel.beatsPerBar, m, BEATLENGTH, mel.beatFraction, newX]);
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

function calcNewStaffGap(staff) {
  //staffGap = calcNewStaffGap(staff);
  var stuff = [];
  var maxGap = 0;
  var gap;
  var i;
  
  // Find the highest and lowest points on each staff line.
  score.data.forEach
  (function(mel)
   {	  
   var r = mel.rect;
   if (!r) {return;}
   
   var y = r.y;
   var y1 = r.y + r.height;
   
   if (isNaN(y) || isNaN(y1)) {return;}
   
   
   var maxY = Math.max(y, y1);
   var minY = Math.min(y, y1);
   
   var lineDet = stuff[mel.c.staffCounter];
   if (!lineDet) {lineDet = {maxY:0, minY:999999}; }
   
   lineDet.maxY = Math.max(lineDet.maxY, maxY);
   lineDet.minY = Math.min(lineDet.minY, minY);
   stuff[mel.c.staffCounter] = lineDet;
   });
	
	for (i = 0+2; i < stuff.length; i++) {
	  gap = stuff[i].minY - stuff[i-1].maxY; 
	  maxGap = Math.max(maxGap, gap);
	}	
	
	return maxGap + (1 * staff.details.space);
}


