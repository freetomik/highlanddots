"use strict";

(function() {
 var THISTYPE = "staffControl";
 
 function ThisType() {     
   this.type = THISTYPE;
   this.isPrintable = true;
   this.c = {};
 
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createStaffControl = function() {
   return new ThisType();
 };
 
 ThisType.prototype.calc = function(staff) {
   var c = this.c;
   var space = staff.details.space;
   var hspace = space/2;
   var x = c.x;
   var self=this;
   var dotRadius = 3;
   
   c.dotsBefore = !!this.repeatEnd ;
   c.dotsAfter = !!this.repeatStart;
   c.lineWidth = staff.details.thick;
   
   c.x = staff.details.x;
   c.y = staff.details.noteInfo.f2.y;
   
   c.hasDots = c.dotsBefore || c.dotsAfter;
 
   c.lineWidth = 0;
   if (this.sectionStart) {
     c.drawCommands = function() {
       self.drawLine(staff, x, space/2);
       self.drawLine(staff, x+space, staff.details.thick);
       self.drawDot(staff, x+space+hspace, staff.details.noteInfo.a2.y, dotRadius);
       self.drawDot(staff, x+space+hspace, staff.details.noteInfo.c2.y, dotRadius);
       
     };
     c.lineWidth += hspace + hspace + hspace + dotRadius*2 + staff.details.thick;
     
   }

   

 };
 
 
 ThisType.prototype.getBoundingRect = function(staff) {
   this.calc(staff);  
   var c = this.c;
   
   var o = {
     x: c.x,
     y: c.y,
     width: c.lineWidth,
     height: staff.details.staffHeight
   };
   return o;
 }
 

   ThisType.prototype.drawDot = function(staff, x, y, r) {
     var ctx = staff.details.ctx;
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
     var ctx = staff.details.ctx;
     var c = this.c;
     
     x += thickness /2;
     var lw = ctx.lineWidth;
     ctx.lineWidth = thickness;
     ctx.beginPath();
     ctx.moveTo(x, c.y);
     ctx.lineTo(x, staff.details.noteInfo.e1.y);
     ctx.stroke();
     ctx.closePath();
     ctx.lineWidth = lw;
   };


 
 ThisType.prototype.paint = function(staff) {
   var c = this.c;
   var ctx = staff.details.ctx;
   this.calc(staff);
   //alert([c.x, c.y, staff.details.noteInfo.e1.y]);
   
   if (typeof c.drawCommands === "function") {
     c.drawCommands();
   }
   
 }
}

());

