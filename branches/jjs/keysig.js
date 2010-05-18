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
   logit("keysig---")
   logit(this);
   logit("----------");
   
   var sdet = staff.details;
   var c = this.c;
   var g = score.createGraphic(this.data.keyType);
   g.staffNote = "f2";
   g.calc(staff);
   var r = g.getBoundingRect(staff);

   var order = "F,C,G,D,A,E,B".split(","); // The order for things in a major key.
   if (this.type === "flat") {
     order = order.reverse();
   }
   c.x = sdet.x;
   c.y = sdet.noteInfo.f2.y;
   
   //alert([this.data.count, r.width, sdet.space]);
  c.width = this.data.count * ( r.width + (sdet.space /2));
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
 }
 
 Score.prototype.createKeySig = function() {
   return new ThisType();
 };
}
)();

