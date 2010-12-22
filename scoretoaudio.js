function scoretoaudio(score) {
  var out;
  var i, l, mel;
  var pass = 1;
  var repeatStack = [];
  
  
  l = score.data.length;
  i = 0;
  out = [];
  while (i < l) {
    mel = score.data[i];
    
    if (mel.type === "melody") {
      out.push(mel);
    }
    
    if (mel.repeatStart) {
      mel.repeatCount = 2;
      repeatStack.push(mel);
      pass = 1;
    }
    
    if (mel.repeatEnd) {
      mel = repeatStack.pop;
      if (pass < mel.repeatCount) {
        pass++;
        i = mel.scoreIndex; // The start of the repeat
        i++; // But skip the repeat mel itself.
        continue;
      } 
    }
    
    i++;
  }
}