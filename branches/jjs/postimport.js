/* Since BWW and ABC will have certain aspects of being imported in common,
handle them here rather than maintaining two separate versions in the
import sections
*/

function postImport(score) {
  var i, l, mel;
  var beatUnit;
  var volta = undefined;
  var tupletMelodyMels = undefined; // Save off the tuplets and recalculate them at the end.
  var tupletLength = 0;
  var measureLength = 0;
  var lineLength = 0;
  var measureCount = 1; // People like 1-based, not zero based.
  var lastNewBar; 
  
  for (i = 0, l = score.data.length; i < l; i++) {
    mel = score.data[i];
    if (!mel.type) {continue;}

    if (mel.type === "timesig") {
      beatUnit = mel.beatUnit; 
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
        // FIXME: This needs to calculate the "adjusted" length of tuplets.
        tupletMelodyMels = undefined;
        
      }
    }

    if (mel.type === "staffControl") {
      if (mel.newBar) {
        if (measureLength && lastNewBar) { lastNewBar.measureNumber = measureCount++; }
        //mel.measureNumber = measureLength // DEBUG;
        mel.measureLength = measureLength;
        measureLength = 0;
        lastNewBar = mel;
      }
      
      if (mel.staffEnd) {
        mel.lineLength = lineLength;
        lineLength = 0;
      }
    }
    
    if (mel.type === "melody") {
      mel.beatFraction = beatUnit/mel.duration; 
      
      if (mel.dotType === "dot") { mel.beatFraction *= 1.5; }
      if (mel.dotType === "doubledot") { mel.beatFraction *= 1.75; }
      measureLength += mel.beatFraction;
      lineLength += mel.beatFraction;
      
      if (tupletMelodyMels) { tupletLength += mel.beatFraction; }
      if (volta) { mel.repeatOnPasses = volta.repeatOnPasses;}
    }
    
  }
}