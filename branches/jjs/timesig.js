
"use strict";

(function() {
 var THISTYPE = "timesig";
 function ThisType() {
   this.type = THISTYPE;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 ThisType.prototype.calc = function(staff) {
   var c = this.c;
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var tf = c.font;
   var dim;
   c.x = sdet.x;
   c.y = sdet.noteInfo.f2.y;


   c.bigNum = Math.max(this.beatsPerBar, this.beatUnit);
   
   c.font = "" + (sdet.space*2.5) + "px sans-serif";
   ctx.font = c.font;
   c.height = sdet.noteInfo.e1.y - sdet.noteInfo.f2.y; 
   c.width = 0;
   if (API.isHostMethod(ctx, 'measureText')) {
     c.width = ctx.measureText(c.bigNum).width;
   }
   
   // Alas, not all canvas have a measureText that actually works.
   if (!c.width) {c.width = c.height * 0.5;} 
   ctx.font = tf;
   
 }
 
 ThisType.prototype.getBoundingRect = function(staff) {
   this.calc(staff);
   var sdet = staff.details;
   var c = this.c;
   
   var o = {
     x: c.x,
     y: c.y,
     width: c.width,
     height: c.height
   };
   //alert(o.toSource());
   return o;
 }
 
 
 ThisType.prototype.paint = function(staff) {
   this.calc(staff);
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   
   
   var tf = ctx.font;
   var ta = ctx.textAlign;
   ctx.font = c.font;
   ctx.textAlign = 'start';

   
   if (API.isHostMethod(ctx, 'fillText')) { 
   ctx.fillText(this.beatsPerBar, c.x, sdet.noteInfo.b2.y, c.width);
   ctx.fillText(this.beatUnit, c.x, sdet.noteInfo.e1.y, c.width);
   } else {
     //FIXME:  Handle text on other systems (ie *cough*)
   }
   ctx.font = tf;
   ctx.textAlign = ta;
   
 }
 
 Score.prototype.createTimeSig = function() {
   return new ThisType();
 };
}
)();

