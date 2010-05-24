"use strict";

(function() {
 var THISTYPE = "keysig";
 function ThisType() {
   this.type = THISTYPE;
   this.c = {};                  // Storage area for some commonly used calcuations.
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 
 ThisType.prototype.calc = function(staff) {
   //logit("keysig---")
   //logit(this);
   //logit("----------");
   
   var sdet = staff.details;
   var c = this.c;
   var g = score.createGraphic(this.data.keyType);
   g.staffNote = "f2";
   g.calc(staff);
   var r = g.getBoundingRect(staff);

   c.order = "f2,c2,g2,d2,a2,e2,b2".split(","); // The order for things in a major key.
   if (this.type === "flat") {
     c.order = c.order.reverse();
   }
   c.x = sdet.x;
   c.y = sdet.noteInfo.f2.y;
   
   c.gap = sdet.space /4;
   //alert([this.data.count, r.width, sdet.space]);
  c.width = (this.data.count+1) * ( r.width + c.gap);
  c.height = sdet.staffHeight;
   
 };
 
 
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
   return o;
 }
 
 
 ThisType.prototype.paint = function(staff) {
   var sdet = staff.details;
   var saveX = sdet.x;
   var c = this.c;
   var g, r;
   
   var i;
   for (i = 0; i < this.data.count+1; i++) {
     g = score.createGraphic(this.data.keyType);
     g.staffNote = c.order[i];
     g.calc(staff);
     r = g.getBoundingRect(staff);
     g.paint(staff);
     sdet.x += r.width;
     sdet.x += c.gap;
   }
   
   sdet.x = saveX;
 }
 
 Score.prototype.createKeySig = function() {
   return new ThisType();
 };
}
)();

