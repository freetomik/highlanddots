"use strict";

(function() {
 var THISTYPE = "staffControl";
 
 function ThisType() {     
   this.type = THISTYPE;
   this.isPrintable = true;
   this.c = {};                  // Storage area for some commonly used calcuations.
   
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createStaffControl = function() {
   return new ThisType();
 };
 
 ThisType.prototype.calc = function(staff) {
   var c = this.c;
   var sdet = staff.details;
   
   var space = sdet.space;
   var hspace = space/2;
   var x = c.x;
   var self=this;
   var dotRadius = sdet.space/4;  // How big are the dots for the repeat sections?
   
   c.lineWidth = sdet.thick;
   
   c.x = sdet.x;
   c.y = sdet.noteInfo.f2.y;
   c.y2 = sdet.noteInfo.e1.y;
   
   c.dotY1 = sdet.noteInfo.a2.y;
   c.dotY2 = sdet.noteInfo.c2.y;
   
   c.textY = sdet.noteInfo.g2.y; // Where to draw text
   
   /*
   * Ok, this section I know might seem a bit strange.  Let me describe what I
   am doing here.
   
   * Because calc is called from two places -- the getBoundingBox and the paint
   * functions, I needed to be able to calculate a width without actually doing
   * the painting.
   *
   * The following variables are used.
   * c.lx  -> The current x position we would draw at.
   * myx   -> The old value c.lx.  Keep the old value because we update c.lx
   * _x    -> is the value of myx that is captured in a closure -- this is now
   *          an unchanging value -- a private copy of the variable.
   * c.drawCommands[] -> is an array of functions to execute should we want to
   *                     do the painting.  Captured within this array of anon
   *                     functions are the x values to draw the piece of the 
   *                     figure at.
   *  
   * I choose to write this code this way so that if we decided that drawThick
   * should be a different width, none of the code below has to be adjusted.
   */
   
   function drawThick() {
     var width = space/2;
     var myx = c.lx;
     c.lx += width;
     return (function (_x) {
             return function() {
             self.drawLine(staff, _x, width);
             }
     }(myx));
   }
   
   function drawThin() {
     var width = sdet.thick;
     var myx = c.lx;
     c.lx += width;
     return (function(_x) {
             return function() {
             self.drawLine(staff, _x, width);
             }
     }(myx));
   }
   
   function drawRepeat() {
     var width = dotRadius *2;
     var myx = c.lx;
     c.lx += width;
     return (function(_x) {
             return function() {
             self.drawDot(staff, _x, c.dotY1, dotRadius);
             self.drawDot(staff, _x, c.dotY2, dotRadius);
             }
     }(myx));
   }
   
   
   c.lineWidth = 0;
   c.drawCommands = [];
   
   c.lx = c.x; // Local x
   
   if (this.repeatEnd) {
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawRepeat());         
     c.drawCommands.push(drawThin());
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawThick());
   } else if (this.repeatStart) {
     c.drawCommands.push(drawThick());
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawThin());
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawRepeat());         
   } else if (this.sectionEnd) {
     c.drawCommands.push(drawThin());
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawThick());
   } else if (this.sectionStart) {
     c.drawCommands.push(drawThick());
     c.lx += hspace;  // Skip a bit of space.
     c.drawCommands.push(drawThin());
   } else if (this.newBar | this.staffEnd) {
     c.drawCommands.push(drawThin());
     c.lx += hspace;  // Skip a bit of space.
   };
   c.lineWidth = c.lx - c.x;
 };
 
 
 ThisType.prototype.getBoundingRect = function(staff) {
   var sdet = staff.details;
   var c = this.c;
   
   var o = {
     x: c.x,
     y: c.y,
     width: c.lineWidth,
     height: sdet.staffHeight
   };
   return o;
 }
 
 ThisType.prototype.drawDot = function(staff, x, y, r) {
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   //alert([x, y, r, 0, Math.PI*2, true]);
   ctx.beginPath();
   ctx.arc(x, y, r, 0, Math.PI*2, true);
   ctx.closePath();
   ctx.fill();
 };
 
 ThisType.prototype.drawLine = function(staff, x, thickness) {
   // Drawing a line normally centers the thickness along the pixel
   // desired.  Shift the x position to adjust for this so that x
   // is the left-margin of the line.
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   
   x += thickness /2;
   var lw = ctx.lineWidth;
   ctx.lineWidth = thickness;
   ctx.beginPath();
   ctx.moveTo(x, c.y);
   ctx.lineTo(x, c.y2);
   ctx.stroke();
   ctx.closePath();
   ctx.lineWidth = lw;
 };
 
 ThisType.prototype.paint = function(staff) {      
   var c = this.c;
   var sdet = staff.details;
   var ctx = sdet.ctx;
   // Already been calced -- no need to do it again this.calc(staff);
   //alert([c.x, c.y, sdet.noteInfo.e1.y]);
   
   c.drawCommands.forEach(function(a) {
                          a();
                          });
   
   if (typeof this.measureNumber !== "undefined") {
     var tf = ctx.font;
     var ta = ctx.textAlign;
     var fc = ctx.fillStyle;
     ctx.fillStyle = "blue";
     ctx.font = "" + (sdet.space * 1.5) + "px sans-serif";
     ctx.textAlign = 'center';
     ctx.fillText("" + this.measureNumber, c.x, c.textY);
     
     if (this.str) {
       ctx.fillText("" + this.str, c.x, c.textY - (sdet.space * 1.5));     
     }
     ctx.font = tf;
     ctx.textAlign = ta;
     ctx.fillStyle = fc; 
   }
   
   
 }
 }
 ());

