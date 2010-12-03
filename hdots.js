"use strict";

var G_vmlCanvasManager; // so non-IE won't freak out in canvasInit


function uiLoadTune(ext, tuneText) {
  var startTime = new Date();
  loadTune(ext, tuneText);
  var endTime = new Date();
  var total = (endTime - startTime) / 1000;
  document.getElementById("timeinfo").innerHTML = "Time spent rendering: " + total + " seconds.";
}

var staff =
(
 
 function() {
 
 var HIDDEN_LINE_COLOR = "rgb(200, 200, 200)";
 var details = {};
 var coords = {};

 // These are values that are set at load time, but are user-changeable and
 // shouldn't reset when the score is re-rendered.
 details.thick = 1;          // Thickness of staff line segment
 details.space = 10;         // The thickness of each space
 details.beamStyle = "bww";  // can be "bww" or "straight" or "sloped"
 details.logging = false;    // true | false toggles bounding box tracing
 details.uiTracing = false;  // true | false toggles bounding box tracing
  
 function resetValues() {
   details.height = -1;      // Calculated at run time
   details.width = 0;        // The width of the staff
   details.leftMargin = 10;  // Margin for a new staff line
   details.newTop = 50;      // Top of a new score
   details.top = -1;         // Where to draw the top line of the CURRENT line of music
   details.x = 0;            // Cursor postion
   details.maxX = 0;         // Max width of score
   
   details.barthick = details.space /10;
   details.noteColor1 = "black";
   details.noteColor2 = "green";
   details.noteColor3 = "blue";
   details.noteColor4 = "red";
 }
 resetValues();
 
 function drawStaff(width) {
   var ctx = details.ctx;
   var x, y;
   var halfy;
   
   //Pre-prep the names for the note position lines
   function prepData() {
     /*
     * Figure out all of the notes positions that we can display, and their
     * location on the staff.
     */
     
     //These are the notes that are on the treble cleff, and therefore
     // don't need ledger lines.
     var notesOnStaff = "e1 f1 g1 a2 b2 c2 d2 e2 f2".split(" ");
     
     var i, j;
     var s1 = "a b c d e f g".split(" "); // the notes of the scale
     var l = s1.length;
     var n;
     var onLine = false;
     var o;
     
     details.noteInfo = {};
     for(i = -2; i < 4; i++) { // And extended scale runs this range
       for (j = 0; j < l; j++) {
         n = s1[j] + i;
         o = {
           drawnOnLine: onLine,  // Is this note drawn on the line 'true' or the space 'false'
           needsLedgerLine: notesOnStaff.indexOf(n) === -1 // Do we need a ledger line for this note.
         };
         onLine = !onLine;
         details.noteInfo[n] = o;
       }
     }
     // TJM 'floating note' not attached to staff
     //      used for placing on the UI, within text,etc.
     details.noteInfo.floating = o;
     details.noteInfo.floating.drawnOnLine = false;
     details.noteInfo.floating.needsLedgerLine = false;
     
   }
   prepData();
   //logit(details.noteInfo);
   
   /*
   * Calling this function WITHOUT ARGUMENTS will increment the Y co-ord
   * AND draw a line.
   * Calling this function WITH any ARGUMENT(S) will increment the Y co-ord
   * but WILL NOT draw a line.
   */
   function drawLine() {
     if (arguments.length == 0) ctx.fillRect(x, y, width, details.thick);
     y += details.space;
   }
   
   width = width || details.maxX;
   
   x = details.leftMargin;
   y = details.top;
   coords.x = x;
   coords.y = y;
   
   
   // This is brute force and crude, but it works.
   // Draw the line and record its y position, and record
   // the y position of the space underneath of it.
   // We use the 'y' position for pretty much everything that involves
   // placing things on the screen.
   
   ctx.beginPath();
   
   
   halfy = details.space/2;
   
   //High A line
   ctx.fillStyle = HIDDEN_LINE_COLOR;
   ctx.strokeStyle = HIDDEN_LINE_COLOR;
   details.noteInfo.a3.y = y;
   details.noteInfo.g2.y = y + halfy;
   drawLine(false);
   
   ctx.fillStyle = "black";
   ctx.strokeStyle = "black";
   details.noteInfo.f2.y = y;
   details.noteInfo.e2.y = y + halfy;
   drawLine();
   
   details.noteInfo.d2.y = y;
   details.noteInfo.c2.y = y + halfy;
   drawLine();
   
   details.noteInfo.b2.y = y;
   details.noteInfo.a2.y = y + halfy;
   drawLine();
   
   details.noteInfo.g1.y = y;
   details.noteInfo.f1.y = y + halfy;
   drawLine();
   
   details.noteInfo.e1.y = y;
   details.noteInfo.d1.y = y + halfy;
   drawLine();
   
   ctx.fillStyle = HIDDEN_LINE_COLOR;
   ctx.strokeStyle = HIDDEN_LINE_COLOR;
   details.noteInfo.c1.y = y;
   drawLine(false);
   
   
   details.heigth = y - details.top - details.space;
   ctx.closePath();
   details.top = y;
   
   var y1 = staff.details.noteInfo.e1.y;
   var y2 = staff.details.noteInfo.f2.y;
   details.staffHeight = y1-y2;
   
   var width = staff.details.barthick;
   var x = staff.details.x;
 }
 
 function prepForDrawing() {
   function init() {
     if (typeof G_vmlCanvasManager !== 'undefined') {
       G_vmlCanvasManager.initElement(details.canvas);
     }
   }
   
   var canvasName = "hdots_canvas";
   if (details.ctx) {
     init();
     details.ctx.fillStyle = "#FFF";
     details.ctx.fillRect(0, 0, details.canvas.width, details.canvas.height);
     return;
   }
   
   domTools.removeElementIfExists(canvasName);
   details.canvas = document.createElement("canvas");
   document.getElementById("canvas_div").appendChild(details.canvas);
   init();
   details.canvas.id = canvasName;
   
   var ctx = details.canvas.getContext("2d");
   details.ctx = ctx;
   details.canvas.style.border = "5px solid red";
 }
 
 return {
   resetValues: resetValues,
   prepForDrawing: prepForDrawing,
   drawStaff: drawStaff,
   details: details
 };
 }());


function loadTune(ext, tuneText) {
  var tuneOk = false;
  score.removeAllNodes();
  staff.prepForDrawing(); // Erase old tune.
  tuneOk = parseBWW(tuneText);
  if (tuneOk) {
    plotMusic(score);
  }
}


function plotMusic(score)
{
  var sdet = staff.details;
  
  popupManager.open({
                    close: true,
                    dim: true,
                    message: "Drawing score.  Please wait."
  }
  );
  staff.resetValues();
  setTimeout(function() {plotMusic_inner(score);}, 1);  
}


function plotMusic_inner(score)
{
  var sdet = staff.details;
  var needStaff = true;
  var staffCounter;
  var ctx;
  var staffGap = sdet.space * 6;
  
  function prepNewStaff() {
    staff.drawStaff();
    sdet.x = sdet.leftMargin;
    ctx.fillStyle = sdet.noteColor1;
    ctx.strokeStyle = sdet.noteColor1;
	staffCounter++;
  }
  
  
  function reFlowAndReDraw(doPaint) {
    var cd = {
      w: sdet.maxX,
      h: sdet.top
    };
    staffCounter = 0;
	
    var drawBoundingBox = hdots_prefs.getValueOf("boundingbox") === "true";
    
    sdet.top = sdet.newTop;
    staff.prepForDrawing();
    if (doPaint) {
      sdet.canvas.width = cd.w;
      sdet.canvas.height = cd.h;
      //sdet.canvas.setAttribute("width", cd.w);
      //sdet.canvas.setAttribute("height", cd.h);
    } else {
      sdet.canvas.width = 1000;
      sdet.canvas.height = 1000;
    }
    
    ctx = sdet.ctx;
    ctx.fillStyle = sdet.noteColor1;
    ctx.strokeStyle = sdet.noteColor1;
    
    var delay = [];
    function delayMel(mel, staff) {
      // Currently there are some things broken that can't be delayed
      // But I am working on that
      mel.paint(staff);
      return;
      
      
      var f = (function(_mel, _staff) {
               return function() {
               _mel.paint(_staff);
               };
      }(mel, staff));
      delay.push(f);
    }
    
    function processMel(mel) {
      if (!mel) {return;}
      
      var rect;
      var strokeStyle = ctx.strokeStyle;
      
      if (needStaff) {
        prepNewStaff();
        needStaff = false;
      }
      
      if (mel.forceToX) {
        sdet.x = mel.forceToX;
      }
      
	  if (mel.c) {
	    mel.c.staffCounter = staffCounter;
	  }
      
      if (typeof mel.calc === "function") {
        mel.calc(staff);
      }
      //TODO : enable bounding box for gracenotes in a group
      if (typeof mel.getBoundingRect === "function") {
        rect = mel.getBoundingRect(staff);
        
        if (rect) {
          logit([mel.type, "rect: ", rect.x, rect.y, rect.width, rect.height, mel.paddingRight]);
          mel.rect = rect;
          if (doPaint && drawBoundingBox) {
            try {
              ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
              ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
              ctx.fillStyle = strokeStyle;
              
              // Debugging - mark exactly where the center is.
              ctx.fillStyle = "red";
              ctx.fillRect(rect.x-1, rect.y-1, 2, 2);
              ctx.fillStyle = strokeStyle;
            } catch (err) {
              loger.error(["Bounding box for", mel, err]);
            }
          }
        }
      }
      
      
      
      switch(mel.type) {
      case "melody":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += sdet.space * 2.5;
        break;
      case "gracenote":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += sdet.space * 1.25;
        break;
      case "graphic":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += rect.width;
        break;
      case "beamgroup":
        if (doPaint) {delayMel(mel, staff);}
        break;
      case "phrasegroup":
        if (doPaint) {delayMel(mel, staff);}
        break;
      case "staffControl":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += rect.width;
        break;
      case "timesig":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += rect.width;
        break;
      case "keysig":
        if (doPaint) {delayMel(mel, staff);}
        sdet.x += rect.width;
        break;
      }
      
      if (typeof mel.paddingRight === "number") {
        sdet.x += mel.paddingRight;
      }
      
      sdet.maxX = Math.max(sdet.x, sdet.maxX);
      
      if (mel.staffEnd) {
        needStaff = true;
        sdet.top += staffGap;
      }
    }
    
    try {
      score.metaData.calc(staff, "header");
      if (doPaint && score.metaData) {
        score.metaData.paint(staff, "header");
      }
      sdet.top += score.metaData.getBoundingRect().height + sdet.space;
    } catch(err) {
      loger.error("Unable to render header: " + err);
    }
    
    //NUKE try {
      score.data.forEach(processMel);
    //NUKE } catch(err) {
    //NUKE   alert("Something horrible has happened! I've crashed trying to show that score.\r\n\r\n" +
    //NUKE         "Please forgive me, I'm just a humble bit of Javascript.");
    //NUKE   loger.error("Unable to render body: " + err);
    //NUKE }
    
    try {    
      score.metaData.calc(staff, "footer");
      if (doPaint && score.metaData) {
        score.metaData.paint(staff, "footer");
      }
      sdet.top += score.metaData.getBoundingRect().height + sdet.space;
    } catch (err) {
      loger.error("Unable to render footer: " + err);
    }
  }
  
  var f = hdots_prefs.getPluginFunction("beauty_engine");
  
  
  reFlowAndReDraw(false); // Calculate sizes
  
  staffGap = calcNewStaffGap(staff);
  
  
  f(staff, 1);  // Pass 1
  reFlowAndReDraw(false); // Readjust everything
  f(staff, 2);  // Pass 2
  //reFlowAndReDraw(false); // Calculate sizes
  
  reFlowAndReDraw(true);  // and draw.
  popupManager.close();
  
  makeImageMap(staff, score);
  //logit(sdet); 
}
