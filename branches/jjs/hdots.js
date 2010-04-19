"use strict";

var G_vmlCanvasManager; // so non-IE won't freak out in canvasInit
if (G_vmlCanvasManager !== undefined) { // ie IE
  G_vmlCanvasManager.initElement(document.getElementById("canvas"));
}

function testDraw() {
  staff.prime();
  staff.drawStaff();
  
  var canvas = document.getElementById("canvas");  
  var ctx = canvas.getContext("2d");  
  
  ctx.fillStyle = "rgb(200,0,0)";  
  ctx.fillRect (10, 10, 55, 50);  
  
  ctx.fillStyle = "rgba(0, 0, 200, 0.5)";  
  ctx.fillRect (30, 30, 55, 50);  
}


var staff = 
(
 
 function() {
 var ctx;
 
 var HIDDEN_LINE_COLOR = "rgb(200, 200, 200)";
 
 var details = {
   height: -1,  // Calculated at run time
   width: 700,  // The width of the staff
   thick: 1,    // Thickness of staff line segment
   space: 10,   // The thickness of each space
   top: 50     // Where to draw the top line "F"
 };
 details.barthick = details.space /10;
 details.beamStyle = "straight";  // can be "straight" or "sloped") {
 details.noteColor1 = "black";
 details.noteColor2 = "green";
 details.noteColor3 = "blue";
 details.noteColor4 = "red";
 
 
 var canvas = document.createElement("canvas");
 var coords = {};
 
 function canDraw() {
   return !!canvas.getContext;              
 }
 
 function drawStaff(width) {
   var x, y;
   var halfy;

   //Pre-prep the names for the note position lines
   
   function prepData() {
     var notesOnStaff = "e1 f1 g1 a2 b2 c2 d2 e2 f2".split(" ");
     
     var i, j;
     var s1 = "a b c d e f g".split(" ");
     var l = s1.length;
     var n;
     var onLine = true;
     var o;
     
     details.noteInfo = {};
     for(i = -2; i < 4; i++) {
       for (j = 0; j < l; j++) {
         n = s1[j] + i;
         o = {
           drawnOnLine: onLine,
           needsLedgerLine: notesOnStaff.indexOf(n) === -1 
         };
         
         details.noteInfo[n] = o;
       }
       onLine = !onLine;
     }
   }
   prepData();   
  logit(details.noteInfo);


   function drawLine() {
     ctx.fillRect(x, y, width, details.thick);
     y += details.space;
   }
   
   width = width || details.width;
   
   x = 5;
   y = details.top;
   coords.x = x;
   coords.y = y;
   
   ctx.beginPath();
   
   
   halfy = details.space/2;
   //High A line
   ctx.fillStyle = HIDDEN_LINE_COLOR;
   ctx.strokeStyle = HIDDEN_LINE_COLOR;
   details.noteInfo.a3.y = y; 
   details.noteInfo.g2.y = y + halfy; 
   drawLine();
   
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
   drawLine();
   
   //alert(details.findNote.toSource());   
   
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
   var cv = document.getElementById("canvas");
   if (cv.getContext) {
     ctx = cv.getContext("2d");
   }
   details.ctx = ctx;
 }
 
 return {
   prime: prime,
   canDraw: canDraw,
   drawStaff: drawStaff,
   details: details
 };
 }());

function testImport() {
  var dots = [];
  
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
  
  
  parseBWW(dots);
  plotMusic(score);
}


function plotMusic(score)
{
  staff.prime();
  var ctx = staff.details.ctx;
  var needStaff = true;
  
  ctx.fillStyle = staff.details.noteColor1;
  ctx.strokeStyle = staff.details.noteColor1;
  
  function prepNewStaff() {
    staff.drawStaff();
    staff.details.x = 5;
    ctx.fillStyle = staff.details.noteColor1;
    ctx.strokeStyle = staff.details.noteColor1;
  }
  
  
  score.data.forEach(function(mel) {
                     //logit(["mel: ", mel]);
                     
                     var rect;
                     
                     if (needStaff) {
                       prepNewStaff();
                       needStaff = false;          
                     }
                     
                     //logit(["Ping:", mel]);
                     
                     //TODO : enable bounding box for gracenotes in a group
                     if (typeof mel.getBoundingRect === "function") {
                       rect = mel.getBoundingRect(staff);
                     }
                     
                     switch(mel.type) {
                     case "melody":
                       mel.paint(staff);
                       staff.details.x += staff.details.space * 2.5;
                       break;
                     case "embellishment":
                       mel.paint(staff);
                       staff.details.x += staff.details.space * 1.25;
                       break;
                     case "graphic":
                       mel.paint(staff);
                       staff.details.x += rect.width;
                       break;
                       
                       //TJM
                       //                     case "egrp":
                       //                       mel.paint(staff);
                       //                       staff.details.x += staff.details.space * 1.25 * mel.noteCount();
                       //                       break;
                     }
                     
                     if (mel.newBar) {
                       ctx.fillRect(staff.details.x,
                                    staff.details.noteInfo.f2.y,
                                    staff.details.barthick,
                                    staff.details.staffHeight);
                       
                       staff.details.x += staff.details.barthick * 2;
                     }
                     if (mel.staffEnd) {
                       needStaff = true;
                       staff.details.top += staff.details.space * 3;        
                     }
  });
}

function logit(s) {
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
