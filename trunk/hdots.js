"use strict";

var G_vmlCanvasManager; // so non-IE won't freak out in canvasInit


function uiLoadTune(ext, tuneText) {
  var startTime = new Date();
  loadTune(ext, tuneText);
  var endTime = new Date();
  var total = (endTime - startTime) / 1000;
  document.getElementById("timeinfo").innerHTML = "Time spent rendering: " + total + " seconds.";
}

function testImport2() {
  var startTime = new Date();
  testImport();
  var endTime = new Date();
  var total = (endTime - startTime) / 1000;
  document.getElementById("timeinfo").innerHTML = "Time spent rendering: " + total + " seconds.";
}

var staff = 
(
 
 function() {
 
 var HIDDEN_LINE_COLOR = "rgb(200, 200, 200)";
 
 var details = {
   height: -1,  // Calculated at run time
   width: 700,  // The width of the staff
   thick: 1,    // Thickness of staff line segment
   space: 10,   // The thickness of each space
   leftMargin: 10, // Margin for a new staff line
   newTop: 50,   // Top of a new score
   top: -1,     // Where to draw the top line of the CURRENT line of music
   x: 0,        // Cursor postion
   maxX: 0      // Max width of score
 };
 details.barthick = details.space /10;
 details.beamStyle = "bww";  // can be "bww" or "straight" or "sloped"
 details.noteColor1 = "black";
 details.noteColor2 = "green";
 details.noteColor3 = "blue";
 details.noteColor4 = "red";
 details.logging = false;        // true | false toggles bounding box tracing
 details.uiTracing = false;        // true | false toggles bounding box tracing
 
 var coords = {};
 
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
 
 function prime() {
   function init() {
     if (typeof G_vmlCanvasManager !== 'undefined') {
       G_vmlCanvasManager.initElement(details.canvas);
     }
   }
   
   var canvasName = "hdots_canvas";
   if (details.ctx) {
     init();
     details.ctx.fillStyle = "#0c0";
     details.ctx.fillRect(0, 0, details.canvas.width, details.canvas.height);
     return;
   } 
   
   domTools.removeElementIfExists(canvasName);
   details.canvas = document.createElement("canvas");
   init();
   details.canvas.id = canvasName;
 
   var ctx = details.canvas.getContext("2d");
   details.ctx = ctx;
   details.canvas.style.border = "5px solid red";
   document.getElementById("canvas_div").appendChild(details.canvas);
 }
 
 return {
   prime: prime,
   drawStaff: drawStaff,
   details: details
 };
 }());


function loadTune(ext, tuneText) {
  var dots;// = [];
  dots = tuneText.split("\n|\r");
  score.removeAllNodes();
  parseBWW(dots);
  plotMusic(score);

}

function testImport() {
  var dots = [];
/*
dots.push('& sharpf sharpc 4_4');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2  !t');
//*/

//*

  
dots.push('Bagpipe Reader:1.0');
dots.push('MIDINoteMappings,(55,57,59,60,62,64,65,67,69,57,59,61,62,64,66,67,69,71,56,58,60,61,63,65,66,68,70)');
dots.push('FrequencyMappings,(392,440,494,523,587,659,699,784,880,440,494,554,587,659,740,784,880,988,415,466,523,554,622,699,740,831,932)');
dots.push('InstrumentMappings,(61,71,46,34,1000,60,70)');
dots.push('GracenoteDurations,(42,40,30,50,100,200,800,1200,250,250,250,500,200)');
dots.push('FontSizes,(90,100,100,80,0)');
dots.push('TuneFormat,(1,0,M,L,500,500,500,500,P,0,0)');
dots.push('TuneTempo,90');
dots.push('');
dots.push('"Layout Tester",(T,L,0,0,Times New Roman,16,700,0,0,18,0,0,0)');
dots.push('"Test",(Y,C,0,0,Times New Roman,14,400,0,0,18,0,0,0)');
dots.push('"Jeremy J Starcher",(M,R,0,0,Times New Roman,14,400,0,0,18,0,0,0)');
dots.push('"It just is",(F,R,0,0,Times New Roman,10,400,0,0,18,0,0,0)');
dots.push('');

dots.push('& sharpf sharpc 4_4');
dots.push('!	 LG_1');
dots.push('!	 LA_1');
dots.push('!	 B_1');
dots.push('!	 C_1');
dots.push('!t');
dots.push('');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 D_2				E_2');
dots.push('!	 F_2				HA_2');
dots.push('!	 HA_2				LG_2');
dots.push('!	 LA_2				B_2');
dots.push('!t');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 E_4				E_4			E_4				E_4');
dots.push('!	 E_4				E_4			E_4				E_4');
dots.push('!	 E_4				E_4			E_4				E_4');
dots.push('!	 E_4				E_4			E_4				E_4');
dots.push('!t');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 E_8				E_8			E_8				E_8	 E_8				E_8			E_8				E_8');
dots.push('!	 E_8				E_8			E_8				E_8	 E_8				E_8			E_8				E_8');
dots.push('!	 E_8				E_8			E_8				E_8	 E_8				E_8			E_8				E_8');
dots.push('!	 E_8				E_8			E_8				E_8	 E_8				E_8			E_8				E_8');
dots.push('!t');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 thrd E_4				thrd E_4			thrd E_4				thrd E_4');
dots.push('!	 gg E_4				gg E_4			gg E_4				gg E_4');
dots.push('!	 dbha E_4				dbha E_4			dbha E_4				dbha E_4');
dots.push('!	 E_4				E_4			E_4				E_4');
dots.push('!t');
  

dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 gg E_1');
dots.push('!	 gg E_1');
dots.push('!	 gg E_1');
dots.push('!	 gg E_1');
dots.push('!t');
dots.push('');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2');
dots.push('!	 gg E_2				gg E_2');
dots.push('!t');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 gg E_4				gg E_4			gg E_4				gg E_4');
dots.push('!	 gg E_4				gg E_4			gg E_4				gg E_4');
dots.push('!	 gg E_4				gg E_4			gg E_4				gg E_4');
dots.push('!	 gg E_4				gg E_4			gg E_4				gg E_4');
dots.push('!t');
dots.push('');
dots.push('& sharpf sharpc 4_4');
dots.push('!	 gg E_8				gg E_8			gg E_8				gg E_8	 gg E_8				gg E_8			gg E_8				gg E_8');
dots.push('!	 gg E_8				gg E_8			gg E_8				gg E_8	 gg E_8				gg E_8			gg E_8				gg E_8');
dots.push('!	 gg E_8				gg E_8			gg E_8				gg E_8	 gg E_8				gg E_8			gg E_8				gg E_8');
dots.push('!	 gg E_8				gg E_8			gg E_8				gg E_8	 gg E_8				gg E_8			gg E_8				gg E_8');
dots.push('!t');
dots.push('');


  // Greensleeves
  dots.push("");
  dots.push("& sharpf sharpc  6_8  I!''~B_8");
  dots.push("! thrd D_4 E_8~gg Fr_8 'f HGl_16 Fl_8");
  dots.push("! dbe E_4 C_8~gg LAr_8 'la Bl_16 Cl_8");
  dots.push("! thrd D_4 B_8~dbb Br_8 'b LAl_16 Bl_8");
  dots.push("! dbc C_4 LA_8~brl LA_4 B_8");
  dots.push("!t");
  dots.push("");
  dots.push("& sharpf sharpc thrd D_4~E_8~gg Fr_8 'f HGl_16 Fl_8");
  dots.push("! dbe E_4 C_8~gg LAr_8 'la Bl_16 Cl_8");
  dots.push("! thrd Dr_8 'd Cl_16 Bl_8~dbc Cr_8 'c Bl_16 LAl_8");
  dots.push("! gg B_4 'b grp B_4 ''!I");
  dots.push("");
  dots.push("");
  dots.push("& sharpf sharpc  I!''~LA_8");
  dots.push("! dbha HA_4 'ha~gg HAr_8 'ha HGl_16 Fl_8");
  dots.push("! dbe E_4~C_8~gg LAr_8 'la Bl_16 Cl_8");
  dots.push("! thrd D_4~B_8~dbb Br_8 'b LAl_16 Bl_8");
  dots.push("! dbc C_4 LA_8 brl LA_4 'la");
  dots.push("!t");
  dots.push("");
  dots.push("& sharpf sharpc");
  dots.push(" dbha HA_4 'ha~gg HAr_8 'ha HGl_16 Fl_8");
  dots.push("! dbe E_4~C_8~gg LAr_8 'la Bl_16 Cl_8");
  dots.push("! thrd Dr_8 'd Cl_16 Bl_8~dbc Cr_8 'c Bl_16 LAl_8");
  dots.push("! gg B_4 'b~grp B_4 ''!I");
  
  // Simple gifts
  dots.push("");
  dots.push("& sharpf sharpc 4_4 LAr_8 dg LAl_8");
  dots.push("!~thrd D_4~gg Dr_8 El_8~dbf Fr_8 Dl_8~gg Fr_8 HGl_8");
  dots.push("!~HA_4~~gg HAr_8 HGl_8~hdbf F_4~Er_8 Dl_8"); 
  dots.push("!~E_4~~strla E_4~gg E_4~~D_4");
  dots.push("!~gg Er_8 Fl_8~gg Er_8 Cl_8~strlg LA_4~brl LA_4 !t");
  dots.push("");
  dots.push("& sharpf sharpc~thrd D_4~gg Dr_8 El_8~dbf Fr_8 Dl_8~gg Fr_8 HGl_8");
  dots.push("!~HA_4~~gg HAr_8 HGl_8~hdbf F_4~Er_8 Dl_8"); 
  dots.push("!~E_4~~strla E_4~F_4~~dbf Fr_8 El_8");
  dots.push("!~thrd D_4~gstd Dr_8 El_8~thrd D_2~!I");
  dots.push("");
  dots.push("& sharpf sharpc ~dbha HA_2~hdbf F_4 'f ~E_8");
  dots.push("!~gg Fr_8 HGl_8~hdbf Fr_8 El_8~thrd D_4~gg Dr_8 El_8"); 
  dots.push("!~F_4~~eg Fr_8 HGl_8~dbha HA_4~HGr_8 Fl_8");
  dots.push("!~dbe E_4~~strla Er_8 Fl_8~gg E_4~~LAr_8 dg LAl_8 !t");
  dots.push("");
  dots.push("& sharpf sharpc~thrd D_4~gg Dr_8 El_8~dbf Fr_8 Dl_8~gg Fr_8 HGl_8");
  dots.push("!~HA_4~~gg HAr_8 HGl_8~hdbf F_4~Er_8 Dl_8"); 
  dots.push("!~dbe E_4~~strla E_4~F_4~~dbf Fr_8 El_8");
  dots.push("!~thrd D_4~gstd Dr_8 El_8~thrd D_4 !I");
  
  // Notation tests
  dots.push("");
  dots.push("& sharpf sharpc 4_4 ");
  dots.push("! ^ts D_4 D_8 ^te El_8~dbf ^ts Fr_8 Dl_8 ^te ~gg ^ts Fr_8 HGl_8 ^te");
  dots.push("! ^3s D_4 D_8 El_8 ^3e ~dbf ^3s Fr_8 Dl_8 ~gg Fr_8 ^3e HGl_8");
  dots.push("! '1 D_4 F_8 '_ El_8~dbf Br_8 '2 Cl_8 ~gg Fr_8 HGl_8 _' !t");
  dots.push("");
  //*/
  
  score.removeAllNodes();
  parseBWW(dots);
  plotMusic(score);
}


function plotMusic(score)
{
  var sdet = staff.details;
  var needStaff = true;
  
  var ctx;  
  
  function prepNewStaff() {
    staff.drawStaff();
    sdet.x = sdet.leftMargin;
    ctx.fillStyle = sdet.noteColor1;
    ctx.strokeStyle = sdet.noteColor1;
  }
  
  
  function reFlowAndReDraw(doPaint) {
    var cd = {
      w: sdet.maxX,
      h: sdet.top
    };

   var drawBoundingBox = hdots_prefs.getValueOf("boundingbox") === "true";
    
    sdet.top = sdet.newTop;
    staff.prime();
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

    if (doPaint && score.metaData) {
      score.metaData.calc(staff);
      score.metaData.paint(staff);
      sdet.top += score.metaData.getBoundingRect().height + sdet.space;
    }

    score.data.forEach(function(mel) {
                       var rect;
                       var strokeStyle = ctx.strokeStyle; 
                       
                       if (needStaff) {
                         prepNewStaff();
                         needStaff = false;          
                       }

                       if (mel.forceToX) {
                         sdet.x = mel.forceToX;
                       }

                       
                       if (typeof mel.calc === "function") {
                         mel.calc(staff);
                       }
                       //TODO : enable bounding box for gracenotes in a group
                       if (typeof mel.getBoundingRect === "function") {
                         rect = mel.getBoundingRect(staff);
                         
                         if (rect) {
                           //logit([mel.type, "rect: ", rect.x, rect.y, rect.width, rect.height, mel.paddingRight]);
                           mel.rect = rect;
                           if (doPaint && drawBoundingBox) {
                             ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                             ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                             ctx.fillStyle = strokeStyle;
                             
                             // Debugging - mark exactly where the center is.
                             ctx.fillStyle = "red";
                             ctx.fillRect(rect.x-1, rect.y-1, 2, 2);
                             ctx.fillStyle = strokeStyle;
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
                         
                       }
                       
                       if (typeof mel.paddingRight === "number") {
                         sdet.x += mel.paddingRight;
                       }
                       
                       sdet.maxX = Math.max(sdet.x, sdet.maxX);
                       
                       if (mel.staffEnd) {
                         needStaff = true;
                         sdet.top += sdet.space * 3;        
                       }
    });
    
    for (var i = 0; i < delay.length; i++) {
      delay[i]();
    }
  }
  
  reFlowAndReDraw(false); // Calculate sizes
  
  
  var f = hdots_prefs.getPluginFunction("beauty_engine");
  f(score);
  
  //beautifyScore(score);  
  
  reFlowAndReDraw(false); // Calculate sizes

  reFlowAndReDraw(true);  // and draw.
  makeImageMap(staff, score);
  
  
  //logit(sdet);  
  
}

function logit(s) {
  if (hdots_prefs.getValueOf("logging") !== "true") {return;}
  
  
  if (typeof s === "object") { // Yes, it catches arrays.  That is good.
    //s = "" + s.toSource();
    // TJM line below causes too much recursion error
    //     as a result of having objects reference 
    //     any containing collections
    s = JSON.stringify(s, undefined, 2);
    
  }
  
  var e = document.getElementById("log");
  var e1 = document.createElement("div");
  var t = document.createTextNode(s);
  e1.appendChild(t);
  e.appendChild(e1);
}


