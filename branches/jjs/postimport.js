"use strict";

/* Since BWW and ABC will have certain aspects of being imported in common,
handle them here rather than maintaining two separate versions in the
import sections
*/

function postImport(score) {
  var i, l, mel;
  var beatUnit;
  var beatsPerBar;
  
  var volta = undefined;
  var tupletMelodyMels = undefined; // Save off the tuplets and recalculate them at the end.
  var tupletLength = 0;
  var measureLength = 0;
  var lineLength = 0;
  var measureCount = 1; // People like 1-based, not zero based.
  var lastNewBar; 
  var maxMeasuresInLine
  var lineMeasureNumber = 0;
  var staffLine = 1;
  
  for (i = 0, l = score.data.length; i < l; i++) {
    mel = score.data[i];
    if (!mel.type) {continue;}
    
    if (mel.type === "timesig") {
      beatUnit = mel.beatUnit; 
      beatsPerBar = mel.beatsPerBar;
    }
    
    if (mel.type === "phrasegroup" && mel.collectionName === "voltas") {
      if (mel.sectionStart) { volta = mel; }
      if (mel.sectionEnd) { volta = undefined; }
    }
    
    if (mel.type === "phrasegroup" && mel.collectionName === "triplets") {
      if (mel.sectionStart) {
        tupletMelodyMels = [];
        tupletLength = 0;
      }
      if (mel.sectionEnd) {
        // FIXME: This needs to calculate the /adjusted/ length of tuplets.
        tupletMelodyMels = undefined;
        
      }
    }
    
    if (mel.type === "staffControl") {
      if (mel.newBar) {
        if (measureLength && lastNewBar) { 
          lastNewBar.measureNumber = measureCount;
          lastNewBar.str = [staffLine, lineMeasureNumber].join(":"); 
          lastNewBar.beatsPerBar = beatsPerBar;
          lastNewBar.measureLength = measureLength;
          if (measureLength !== beatsPerBar) {
            if (lineMeasureNumber === 0) {
              lastNewBar.isLeadIn = true;
            } else {
              lastNewBar.isLeadOut = true;
            }
          }
          lineMeasureNumber++;
          measureCount++;
        }
        //mel.measureNumber = measureLength // DEBUG;
        mel.measureLength = measureLength;
        measureLength = 0;
        lastNewBar = mel;
      }
      
      if (mel.staffEnd) {
        maxMeasuresInLine = Math.max(maxMeasuresInLine, lineMeasureNumber);
        staffLine++;
        mel.lineLength = lineLength;
        lineMeasureNumber = 0;
        lineLength = 0;
      }
    }
    
    if (mel.type === "melody") {
      mel.beatFraction = beatUnit/mel.duration; 
      
      //TODO: Handle hold-cut note lengths properly.
      
      if (mel.dotType === "dot") { mel.beatFraction *= 1.5; }
      if (mel.dotType === "doubledot") { mel.beatFraction *= 1.75; }
      measureLength += mel.beatFraction;
      lineLength += mel.beatFraction;
      
      if (tupletMelodyMels) { tupletLength += mel.beatFraction; }
      if (volta) { mel.repeatOnPasses = volta.repeatOnPasses;}
    }
    
  }
}