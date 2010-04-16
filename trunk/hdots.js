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
   top: 10      // Where to draw the top line "F"
 };
 details.barthick = details.space /10;
 
 var canvas = document.createElement("canvas");
 var coords = {};
 
 function canDraw() {
   return !!canvas.getContext;              
 }
 
 function drawStaff(width) {
   var x, y;
   var halfy;
   
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
   
   details.findNote = {};
   
   halfy = details.space/2;
   //High A line
   ctx.fillStyle = HIDDEN_LINE_COLOR;
   ctx.strokeStyle = HIDDEN_LINE_COLOR;
   details.findNote.a3 = y; 
   details.findNote.g2 = y + halfy; 
   drawLine();
   
   ctx.fillStyle = "black";
   ctx.strokeStyle = "black";
   details.findNote.f2 = y; 
   details.findNote.e2 = y + halfy; 
   drawLine();
   
   details.findNote.d2 = y; 
   details.findNote.c2 = y + halfy; 
   drawLine();
   
   details.findNote.b2 = y; 
   details.findNote.a2 = y + halfy; 
   drawLine();
   
   details.findNote.g1 = y; 
   details.findNote.f1 = y + halfy; 
   drawLine();
   
   details.findNote.e1 = y; 
   details.findNote.d1 = y + halfy; 
   drawLine();
   
   ctx.fillStyle = HIDDEN_LINE_COLOR;
   ctx.strokeStyle = HIDDEN_LINE_COLOR;
   details.findNote.c1 = y; 
   drawLine();
   
   //alert(details.findNote.toSource());   
   
   details.heigth = y - details.top - details.space;
   ctx.closePath();
   details.top = y;
   
   var y1 = staff.details.findNote.e1;
   var y2 = staff.details.findNote.f2;
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
  
  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  
  function prepNewStaff() {
    staff.drawStaff();
    staff.details.x = 5;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
  }
  
  
  score.data.forEach(function(mel) {
                     //logit(["mel: ", mel]);
                     
                     var rect;
                     
                     if (needStaff) {
                       prepNewStaff();
                       needStaff = false;          
                     }
                     
                     // logit(["Ping:", mel]);
                     
                     if (typeof mel.getBoundingRect === "function") {
                       rect = mel.getBoundingRect(staff);
                     }
                     
                     switch(mel.type) {
                     case "melody":
                       mel.paint(staff);
                       staff.details.x += staff.details.space * 2.5;
                       break;
                     case "egrp":
                       mel.paint(staff);
                       staff.details.x += staff.details.space * 1.25 * mel.noteCount();
                       break;
                     case "graphic":
                       mel.paint(staff);
                       staff.details.x += 20;
                       break;

                     }
                     
                     if (mel.newBar) {
                       
                       ctx.fillRect(staff.details.x,
                                    staff.details.findNote.f2,
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
    s = JSON.stringify(s, undefined, 2);
  }
  
  var e = document.getElementById("log");
  var e1 = document.createElement("div");
  var t = document.createTextNode(s);
  e1.appendChild(t);
  e.appendChild(e1);
}
