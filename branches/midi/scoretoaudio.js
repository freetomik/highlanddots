/* Traverse score; for each "melody" or "gracenote" elements
 * generate appropriate Note On/Off MIDI events
 */

// Piano keyboard -> MIDI note number
// G: 55, G#: 56, A: 57, A#: 58, B: 59, C: 60 /*C4*/, C#: 61, D: 62, 
// D#: 63, E: 64, F: 65, F#: 66, G: 67, G#: 68, A: 69, A#: 70, B: 71

// GHB -> MIDI note mapping
// [A=A, A=Bb] 
var HDotsMidiMap = {
  "bass": [31, 32],
  "tenor": [43, 44],
  "g1": [55,56],
  "a2": [57,58],
  "b2": [59,60],
  "c2": [61,62],
  "d2": [62,63],
  "e2": [64,65],
  "f2": [66,67],
  "g2": [67,68],
  "a3": [69,70]
};

// Midi event codes
var EVT_NOTE_OFF           = 0x8;
var EVT_NOTE_ON            = 0x9;
var EVT_AFTER_TOUCH        = 0xA;
var EVT_CONTROLLER         = 0xB;
var EVT_PROGRAM_CHANGE     = 0xC;
var EVT_CHANNEL_AFTERTOUCH = 0xD;
var EVT_PITCH_BEND         = 0xE;



/*
 * score The score to traverse
 * ticks The number of ticks per quarter note
 */
function scoretoaudio(score, ticks) {

alert(window.EVT_PROGRAM_CHANGE);
  var evnts;
  var i, l, mel;
  var pass = 1;
  var repeatStack = [];

  
  l = score.data.length;
  i = 0;
  evnts = [];
  
      evnts.push(new MidiEvent({
           time: 1,
           type:    EVT_PROGRAM_CHANGE,
           channel: 0,
           param1:  110 // 110 = bagpipe
      }) );

  
  
  while (i < l) {
    mel = score.data[i];

  // TJM : TODO : - adjust note off time correctly for embellishments
  //              - unroll voltas
  //              - enable different tunings

    if (mel.type === "melody") pushNoteMidiEvents(evnts, mel, ticks, mel.duration);
    else if (mel.type === "gracenote" ) pushNoteMidiEvents(evnts, mel, ticks, 64);

/*    
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
*/    
    i++;
  }
  
  logit(evnts);
 
  var track = new MidiTrack({ events: evnts });
  track.setTempo(82);
  var tune  = MidiWriter({ tracks: [track] });
  
  // save => write data URL to new window
  tune.save();
  // paly => add layer with embedded QT plugin and set data URL 
  // tune.play();
 
 
}

function pushNoteMidiEvents(stack, mel, ticks, duration) {
  // TJM : TODO : - adjust note off time correctly for embellishments
  //              - unroll voltas
  //              - remove hardcoded events; rescope Midi event codes in midi.js
  //              - pitch bend events

  // push note on/off midi events onto stack
  stack.push(new MidiEvent({
   time: 0,
   type:    EVT_NOTE_ON,
   channel: 0,
   param1:  HDotsMidiMap[mel.staffPosition][1],
   param2:  90
  }) );
  stack.push(new MidiEvent({
   time: ticks*(4/duration),
   type:    EVT_NOTE_OFF,
   channel: 0,
   param1:  HDotsMidiMap[mel.staffPosition][1],
   param2:  0
  }) );

}
